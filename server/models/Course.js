import mongoose from 'mongoose';

// Recursive Schema for Topics
const TopicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['frontend', 'backend', 'devops', 'python', 'general', 'db'],
    default: 'general' 
  },
}); 

// Add children recursively
TopicSchema.add({
  children: [TopicSchema]
});

const CourseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // 'python' | 'react' | 'code'
  duration: { type: String, default: '' }, // e.g., "8 weeks", "40 hours"
  category: { 
    type: String, 
    enum: ['IT', 'Design', 'Finance', 'Marketing', 'Business', 'Other'],
    default: 'IT'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  thumbnail: { type: String, default: '' }, // URL to thumbnail image
  data: [TopicSchema] // The syllabus tree
}, { timestamps: true });

export default mongoose.model('Course', CourseSchema);