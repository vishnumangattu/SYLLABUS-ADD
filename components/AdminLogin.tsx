import React, { useState } from 'react';
import { login } from '../api';
import { Lock, LogIn } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login(formData);

      localStorage.setItem('token', res.data.token);
      if (res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }

      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto p-6">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl w-full shadow-2xl backdrop-blur-xl transition-all duration-300">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary/20 rounded-full text-primary">
            <Lock size={32} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Admin Access
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          Login to your dashboard
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={18} /> Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={onCancel}
            className="w-full text-slate-500 hover:text-white text-sm transition-colors"
          >
            Cancel and go back
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
