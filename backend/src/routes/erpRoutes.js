import express from 'express';
import {
  createAttendance,
  createEvent,
  createFaculty,
  createFee,
  createResult,
  listAttendance,
  listEvents,
  listFaculty,
  listFees,
  listResults,
  smartSearch
} from '../controllers/erpController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/attendance').get(listAttendance).post(authorize('admin', 'faculty'), createAttendance);
router.route('/fees').get(listFees).post(authorize('admin', 'clerk'), createFee);
router.route('/results').get(listResults).post(authorize('admin', 'faculty'), createResult);
router.route('/faculty').get(listFaculty).post(authorize('admin'), createFaculty);
router.route('/events').get(listEvents).post(authorize('admin', 'faculty', 'clerk'), createEvent);
router.get('/smart-search', smartSearch);

export default router;
