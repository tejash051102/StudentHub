import express from 'express';
import { getPublicSummary } from '../controllers/publicController.js';

const router = express.Router();

router.get('/summary', getPublicSummary);

export default router;
