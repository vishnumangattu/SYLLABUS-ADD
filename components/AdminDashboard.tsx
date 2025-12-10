import React, { useState, useMemo } from 'react';
import { deleteCourse, logout } from '../api';
import { Plus, Edit, Trash2, LogOut, Search, Filter, X, Database, Key } from 'lucide-react';
import ChangePassword from './ChangePassword';

const AdminDashboard = ({ courses, onEdit, onCreate, onLogout, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      await deleteCourse(id);
      onRefresh();
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      onLogout();
    }
  };

  // Filter courses based on search, category, and level
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !categoryFilter || course.category === categoryFilter;
      const matchesLevel = !levelFilter || course.level === levelFilter;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchTerm, categoryFilter, levelFilter]);

  const categories = ['IT', 'Design', 'Finance', 'Marketing', 'Business', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
           <p className="text-slate-400">Manage your learning pathways</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowChangePassword(true)} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <Key size={16} /> Change Password
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300">
            <LogOut size={16} /> Logout
          </button>
          <button onClick={onCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold shadow-lg shadow-primary/20">
            <Plus size={18} /> New Course
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(categoryFilter || levelFilter) && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-slate-400">Active filters:</span>
            {categoryFilter && (
              <span className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                {categoryFilter}
                <button onClick={() => setCategoryFilter('')} className="hover:text-primary/70">
                  <X size={14} />
                </button>
              </span>
            )}
            {levelFilter && (
              <span className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                {levelFilter}
                <button onClick={() => setLevelFilter('')} className="hover:text-primary/70">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-slate-900/50 border border-slate-800 rounded-xl group hover:border-primary/50 transition-all overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail Section */}
              <div className="md:w-48 h-48 md:h-auto relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex-shrink-0">
                {course.thumbnail ? (
                  <>
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent hidden" />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 hidden">
                      <Database size={32} className="text-slate-500" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Database size={48} className="text-slate-600" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{course.title}</h3>
                    <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">{course.id}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{course.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {course.duration && (
                      <span className="px-2 py-1 bg-slate-800/50 rounded text-slate-400">
                        ⏱️ {course.duration}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      {course.level}
                    </span>
                    <span className="px-2 py-1 bg-slate-800/50 rounded text-slate-400">
                      {course.data?.length || 0} Modules
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(course.id)} 
                    className="p-2 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)} 
                    className="p-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            <p className="text-slate-500">
              {courses.length === 0 
                ? 'No courses found. Create one to get started.' 
                : 'No courses match your search criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative">
            <ChangePassword
              onCancel={() => setShowChangePassword(false)}
              onSuccess={() => setShowChangePassword(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;