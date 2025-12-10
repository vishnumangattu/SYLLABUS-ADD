import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '5mb' })); // Increased limit for large syllabus JSON
app.use(cors());

// DB Config
const db = process.env.MONGO_URI; 

mongoose.connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));