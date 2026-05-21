import express from 'express';
import { login, register } from '../controllers/authController.js';
import { uploadProfilePhoto } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', uploadProfilePhoto.single('profilePhoto'), register);
router.post('/login', login);

export default router;
