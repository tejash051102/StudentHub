import express from 'express';
import { getPendingUsers, updateApproval } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/pending', getPendingUsers);
router.patch('/:id/approval', updateApproval);

export default router;
