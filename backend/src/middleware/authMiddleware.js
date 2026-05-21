import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
