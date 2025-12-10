import React, { useState, useEffect } from 'react';
import { createCourse, updateCourse, fetchCourseDetails } from '../api';
import { Save, X, AlertCircle } from 'lucide-react';
import SyllabusBuilder from './SyllabusBuilder';

const CourseEditor = ({ courseId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: 'general',
    duration: '',
    category: 'IT',
    level: 'Beginner',
    thumbnail: '',
    data: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      fetchCourseDetails(courseId).then(res => {
        setFormData(res.data);
        setLoading(false);
      }).catch(err => {
        setError('Failed to load course details');
        setLoading(false);
      });
    }
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      if (courseId) {
        await updateCourse(courseId, payload);
      } else {
        await createCourse(payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save course');
    }
  };

  const handleSyllabusChange = (newData: any[]) => {
    setFormData({ ...formData, data: newData });
  };

  if (loading) return <div className="text-white text-center p-10">Loading Editor...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{courseId ? 'Edit Course' : 'Create New Course'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
          <X />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Course ID (URL Slug)</label>
            <input 
              type="text" 
              required
              disabled={!!courseId}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white disabled:opacity-50"
              value={formData.id}
              onChange={e => setFormData({...formData, id: e.target.value})}
              placeholder="e.g., mern-stack"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Course Name *</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Course Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Description *</label>
          <textarea 
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white h-24"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Describe what students will learn in this course"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Duration</label>
            <input 
              type="text" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g., 8 weeks, 40 hours"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Category *</label>
            <select 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="IT">IT</option>
              <option value="Design">Design</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Level *</label>
            <select 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Icon Type</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
            >
              <option value="general">Generic</option>
              <option value="networking">Networking</option>
              <option value="code">Web Application Development</option>
              <option value="dm">Digital Marketing</option>
              <option value="cyber">Cyber Security</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Thumbnail Image URL (Optional)</label>
          <input 
            type="url" 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
            value={formData.thumbnail}
            onChange={e => setFormData({...formData, thumbnail: e.target.value})}
            placeholder="https://example.com/image.jpg"
          />
          {formData.thumbnail && (
            <div className="mt-3">
              <img 
                src={formData.thumbnail} 
                alt="Thumbnail preview" 
                className="max-w-xs h-32 object-cover rounded-lg border border-slate-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <SyllabusBuilder data={formData.data} onChange={handleSyllabusChange} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg hover:bg-slate-800 text-slate-300">
            Cancel
          </button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold">
            <Save size={18} />
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditor;