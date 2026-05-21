import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';
import Faculty from '../models/Faculty.js';
import Fee from '../models/Fee.js';
import Result from '../models/Result.js';
import Student from '../models/Student.js';
import { logActivity } from '../utils/activity.js';

function scoped(userId) {
  return { createdBy: userId };
}

export async function listAttendance(req, res, next) {
  try {
    const records = await Attendance.find(scoped(req.user._id))
      .populate('student', 'firstName lastName rollNumber department course')
      .sort({ date: -1 })
      .limit(200);
    res.json(records);
  } catch (error) {
    next(error);
  }
}

export async function createAttendance(req, res, next) {
  try {
    const record = await Attendance.create({ ...req.body, createdBy: req.user._id });
    await logActivity(req.user._id, 'Marked attendance', 'Attendance', { attendanceId: record._id });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

export async function listFees(req, res, next) {
  try {
    const fees = await Fee.find(scoped(req.user._id))
      .populate('student', 'firstName lastName rollNumber department')
      .sort({ dueDate: 1 });
    res.json(fees);
  } catch (error) {
    next(error);
  }
}

export async function createFee(req, res, next) {
  try {
    const status =
      Number(req.body.paidAmount || 0) >= Number(req.body.amount || 0)
        ? 'Paid'
        : Number(req.body.paidAmount || 0) > 0
          ? 'Partial'
          : 'Pending';
    const fee = await Fee.create({ ...req.body, status, createdBy: req.user._id });
    await logActivity(req.user._id, 'Created fee record', 'Fee', { feeId: fee._id });
    res.status(201).json(fee);
  } catch (error) {
    next(error);
  }
}

export async function listResults(req, res, next) {
  try {
    const results = await Result.find(scoped(req.user._id))
      .populate('student', 'firstName lastName rollNumber department course')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function createResult(req, res, next) {
  try {
    const subjects = req.body.subjects || [];
    const total = subjects.reduce((sum, subject) => sum + Number(subject.marks || 0), 0);
    const max = subjects.reduce((sum, subject) => sum + Number(subject.maxMarks || 100), 0) || 1;
    const gpa = Number(((total / max) * 10).toFixed(2));
    const result = await Result.create({ ...req.body, gpa, createdBy: req.user._id });
    await logActivity(req.user._id, 'Published result', 'Result', { resultId: result._id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listFaculty(req, res, next) {
  try {
    const faculty = await Faculty.find(scoped(req.user._id)).sort({ createdAt: -1 });
    res.json(faculty);
  } catch (error) {
    next(error);
  }
}

export async function createFaculty(req, res, next) {
  try {
    const faculty = await Faculty.create({ ...req.body, createdBy: req.user._id });
    await logActivity(req.user._id, 'Added faculty', 'Faculty', { facultyId: faculty._id });
    res.status(201).json(faculty);
  } catch (error) {
    next(error);
  }
}

export async function listEvents(req, res, next) {
  try {
    const events = await Event.find(scoped(req.user._id)).sort({ startsAt: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
}

export async function createEvent(req, res, next) {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    await logActivity(req.user._id, 'Created calendar item', 'Event', { eventId: event._id });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}

export async function smartSearch(req, res, next) {
  try {
    const q = req.query.q || '';
    const students = await Student.find({
      createdBy: req.user._id,
      $or: [
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { rollNumber: new RegExp(q, 'i') },
        { department: new RegExp(q, 'i') },
        { course: new RegExp(q, 'i') }
      ]
    }).limit(12);
    res.json({ query: q, students });
  } catch (error) {
    next(error);
  }
}
