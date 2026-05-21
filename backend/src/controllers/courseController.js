import Course from '../models/Course.js';

export async function getCourses(req, res, next) {
  try {
    const courses = await Course.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    next(error);
  }
}

export async function createCourse(req, res, next) {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
}
