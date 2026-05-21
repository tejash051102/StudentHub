import Activity from '../models/Activity.js';
import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js';
import Fee from '../models/Fee.js';
import Result from '../models/Result.js';
import Student from '../models/Student.js';

export async function getDashboard(req, res, next) {
  try {
    const createdBy = req.user._id;
    const [totalStudents, totalCourses, activeStudents, departments, recentStudents, statusCounts, attendance, pendingFees, averageGpa, activities] =
      await Promise.all([
        Student.countDocuments({ createdBy }),
        Course.countDocuments({ createdBy }),
        Student.countDocuments({ createdBy, status: 'Active' }),
        Student.aggregate([
          { $match: { createdBy } },
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Student.find({ createdBy }).sort({ createdAt: -1 }).limit(5),
        Student.aggregate([
          { $match: { createdBy } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Attendance.aggregate([
          { $match: { createdBy } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Fee.countDocuments({ createdBy, status: { $in: ['Pending', 'Partial', 'Overdue'] } }),
        Result.aggregate([{ $match: { createdBy } }, { $group: { _id: null, value: { $avg: '$gpa' } } }]),
        Activity.find({ actor: createdBy }).sort({ createdAt: -1 }).limit(8)
      ]);

    const present = attendance.find((item) => item._id === 'Present')?.count || 0;
    const attendanceTotal = attendance.reduce((sum, item) => sum + item.count, 0);
    const attendanceRate = attendanceTotal ? Math.round((present / attendanceTotal) * 100) : 0;

    res.json({
      totals: {
        students: totalStudents,
        courses: totalCourses,
        activeStudents,
        departments: departments.length,
        attendance: attendanceRate,
        pendingFees,
        performance: Number((averageGpa[0]?.value || 0).toFixed(1))
      },
      departments,
      statusCounts,
      attendance,
      recentStudents,
      activities,
      alerts: [
        ...(pendingFees ? [{ type: 'fees', message: `${pendingFees} fee records need attention` }] : []),
        ...(attendanceRate && attendanceRate < 75
          ? [{ type: 'attendance', message: 'Attendance rate is below the safe threshold' }]
          : []),
        ...(totalStudents ? [] : [{ type: 'records', message: 'Start by adding student records' }])
      ]
    });
  } catch (error) {
    next(error);
  }
}
