import Course from '../models/Course.js';
import Student from '../models/Student.js';

export async function getDashboard(req, res, next) {
  try {
    const createdBy = req.user._id;
    const [totalStudents, totalCourses, activeStudents, departments, recentStudents, statusCounts] =
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
        ])
      ]);

    res.json({
      totals: {
        students: totalStudents,
        courses: totalCourses,
        activeStudents,
        departments: departments.length
      },
      departments,
      statusCounts,
      recentStudents
    });
  } catch (error) {
    next(error);
  }
}
