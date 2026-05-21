import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Result from '../models/Result.js';

function buildStudentQuery(query) {
  const filter = { createdBy: query.userId };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.department) {
    filter.department = query.department;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.semester) {
    filter.semester = Number(query.semester);
  }

  if (query.batch) {
    filter.batch = new RegExp(query.batch, 'i');
  }

  if (query.course) {
    filter.course = new RegExp(query.course, 'i');
  }

  return filter;
}

export async function getStudents(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
    const skip = (page - 1) * limit;
    const filter = buildStudentQuery({ ...req.query, userId: req.user._id });

    const [students, total] = await Promise.all([
      Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Student.countDocuments(filter)
    ]);

    res.json({
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createStudent(req, res, next) {
  try {
    const student = await Student.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
}

export async function getStudentProfile(req, res, next) {
  try {
    const student = await Student.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const [attendance, fees, results] = await Promise.all([
      Attendance.find({ student: student._id, createdBy: req.user._id }).sort({ date: -1 }).limit(30),
      Fee.find({ student: student._id, createdBy: req.user._id }).sort({ dueDate: 1 }),
      Result.find({ student: student._id, createdBy: req.user._id }).sort({ createdAt: -1 })
    ]);

    res.json({ student, attendance, fees, results });
  } catch (error) {
    next(error);
  }
}

export async function addStudentDocument(req, res, next) {
  try {
    const student = await Student.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.documents.push(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
}

export async function verifyStudentDocument(req, res, next) {
  try {
    const student = await Student.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const document = student.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.verified = true;
    await student.save();
    res.json(student);
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(req, res, next) {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
}

export async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
}
