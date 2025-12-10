import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Generate tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { user: { id: userId, role } },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { user: { id: userId } },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  
  return { accessToken, refreshToken };
};

// Register (One-time setup usually, or protected)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    user = new User({ username, password, role: 'admin' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      token: accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      token: accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ msg: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Check if token exists in database
    const user = await User.findById(decoded.user.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: 'Invalid refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);
    
    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ 
      token: accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ msg: 'Refresh token expired' });
    }
    console.error(err);
    res.status(403).json({ msg: 'Invalid refresh token' });
  }
});

// Logout (invalidate refresh token)
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Change Password (requires authentication)
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id; // From auth middleware

  if (!userId) {
    return res.status(401).json({ msg: 'Authentication required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Request Password Reset (public)
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ msg: 'If user exists, password reset email would be sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In production, send email with reset token
    // For now, return token (remove in production!)
    res.json({ 
      msg: 'Password reset token generated',
      resetToken // Remove this in production, send via email instead
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Reset Password (public, with token)
router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    if (!resetToken || !newPassword) {
      return res.status(400).json({ msg: 'Reset token and new password required' });
    }

    // Hash the token to compare
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;