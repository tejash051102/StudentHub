import express from 'express';
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getStudents).post(createStudent);
router.route('/:id').put(updateStudent).delete(deleteStudent);

export default router;
