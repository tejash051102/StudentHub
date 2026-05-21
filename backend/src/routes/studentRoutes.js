import express from 'express';
import {
  createStudent,
  deleteStudent,
  addStudentDocument,
  getStudentProfile,
  getStudents,
  updateStudent,
  verifyStudentDocument
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getStudents).post(createStudent);
router.get('/:id/profile', getStudentProfile);
router.post('/:id/documents', addStudentDocument);
router.patch('/:id/documents/:documentId/verify', verifyStudentDocument);
router.route('/:id').put(updateStudent).delete(deleteStudent);

export default router;
