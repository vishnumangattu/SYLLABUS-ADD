import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Server, Database, ArrowRight, Layers, Presentation, Shield } from 'lucide-react';

const Home = ({ courses, onSelectCourse }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* Admin Login Navigation */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          to="/adminlogin"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all backdrop-blur-md"
        >
          <Shield size={18} />
          <span className="text-sm font-semibold">Admin Login</span>
        </Link>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 max-w-3xl"
      >
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-primary text-xs font-mono tracking-widest uppercase">
          Interactive Learning Pathways
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tech Stack</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Select a roadmap to begin your journey. Explore structured syllabuses, track your progress, and visualize concepts in 3D.
        </p>
      </motion.div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {courses.map((course, index) => {
          const isDisabled = !course?.data || course.data.length === 0;
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={!isDisabled ? { y: -8, scale: 1.02 } : {}}
              onClick={() => !isDisabled && onSelectCourse(course)}
              className={`
                relative group rounded-2xl border overflow-hidden flex flex-col h-full transition-all duration-300
                ${isDisabled ? 'cursor-not-allowed opacity-60 border-slate-800 bg-slate-900/20' : 'cursor-pointer border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]'}
              `}
            >
              {/* Card Glow */}
              {!isDisabled && (
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Thumbnail Image or Icon Header */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 hidden">
                      {course.icon === 'networking' ? <Server size={48} className="text-slate-500" /> : 
                       course.icon === 'code' ? <Code size={48} className="text-slate-500" /> : 
                       course.icon === 'dm' ? <Presentation size={48} className="text-slate-500"/> : 
                       course.icon === 'cyber' ? <Shield size={48} className="text-slate-500"/> :
                       <Database size={48} className="text-slate-500" />}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className={`p-6 rounded-2xl ${isDisabled ? 'bg-slate-800/50 text-slate-500' : 'bg-slate-800/50 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300'}`}>
                      {course.icon === 'networking' ? <Server size={48} /> : 
                       course.icon === 'code' ? <Code size={48} /> : 
                       course.icon === 'dm' ? <Presentation size={48}/> : 
                       course.icon === 'cyber' ? <Shield size={48}/> :
                       <Database size={48} />}
                    </div>
                  </div>
                )}
                
                {/* Category and Level Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {course.category && (
                    <span className="px-2 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-md text-blue-300 text-xs font-semibold">
                      {course.category}
                    </span>
                  )}
                  {course.level && (
                    <span className="px-2 py-1 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-md text-green-300 text-xs font-semibold">
                      {course.level}
                    </span>
                  )}
                </div>

                {/* Arrow Icon on Hover */}
                {!isDisabled && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg">
                      <ArrowRight className="text-primary" size={20} />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors pr-2">
                    {course.title}
                  </h3>
                </div>
                
                <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">
                  {course.description}
                </p>

                {/* Course Info Footer */}
                <div className="mt-auto pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {course.duration && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{course.duration}</span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                        {isDisabled ? 'Coming Soon' : `${course?.data?.length || 0} Modules`}
                      </span>
                    </div>
                    <Layers size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default Home;