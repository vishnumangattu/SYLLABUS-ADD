import React, { useState } from 'react';
import { changePassword } from '../api';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ChangePassword = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onCancel) onCancel();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-primary/20 rounded-full text-primary">
          <Lock size={32} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-white mb-2">
        Change Password
      </h2>
      <p className="text-slate-400 text-center text-sm mb-6">
        Update your account password
      </p>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle size={18} />
          Password changed successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Current Password</label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="Enter new password (min 6 characters)"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-primary hover:bg-orange-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Changing...' : success ? 'Password Changed!' : 'Change Password'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800">
        <button
          onClick={onCancel}
          className="w-full text-slate-500 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;

