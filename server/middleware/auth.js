import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Basic authentication middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Role-based authorization middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  next();
};

export { requireAdmin };
export default auth;