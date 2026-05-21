import express from 'express';
import { createCourse, deleteCourse, getCourses } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getCourses).post(createCourse);
router.delete('/:id', deleteCourse);

export default router;
