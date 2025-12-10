import express from 'express';
import Course from '../models/Course.js';
import auth, { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get All Courses with optional search
router.get('/', async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = {};
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by level
    if (level) {
      query.level = level;
    }
    
    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get Single Course (Full Data)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create Course (Admin)
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const course = await newCourse.save();
    console.log(course);
    
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update Course (Admin)
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    // Note: We search by custom 'id' string, not MongoDB _id
    let course = await Course.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete Course (Admin)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ id: req.params.id });
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;