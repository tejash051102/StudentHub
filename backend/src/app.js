import cors from 'cors';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { isDatabaseConnected, requireDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import erpRoutes from './routes/erpRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();
const allowedOrigins = new Set([
  process.env.CLIENT_URL || 'http://localhost:7001',
  'http://localhost:7001',
  'http://127.0.0.1:7001'
]);

function isAllowedDevOrigin(origin) {
  return /^http:\/\/(10|172\.(1[6-9]|2\d|3[0-1])|192\.168)\.\d{1,3}\.\d{1,3}:7001$/.test(origin);
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || isAllowedDevOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: isDatabaseConnected() ? 'connected' : 'connecting' });
});

app.use('/api/public', publicRoutes);
app.use('/api', requireDatabase);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
