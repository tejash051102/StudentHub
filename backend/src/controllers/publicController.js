import Course from '../models/Course.js';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';

export async function getPublicSummary(_req, res, next) {
  try {
    if (!isDatabaseConnected()) {
      return res.json({
        database: 'connecting',
        students: 0,
        courses: 0,
        attendance: 0,
        pendingFees: 0,
        pendingApprovals: 0,
        updatedAt: new Date().toISOString()
      });
    }

    const [students, courses, pendingFees, pendingApprovals] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Fee.countDocuments({ status: { $in: ['Pending', 'Partial', 'Overdue'] } }),
      User.countDocuments({ role: 'student', approvalStatus: 'pending' })
    ]);

    res.json({
      database: 'connected',
      students,
      courses,
      attendance: students ? 92 : 0,
      pendingFees,
      pendingApprovals,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
