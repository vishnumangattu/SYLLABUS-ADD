import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'admin' 
  },
  refreshToken: { type: String, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);