import User from '../models/User.js';

export async function getProfile(req, res) {
  res.json(req.user);
}

export async function updateProfile(req, res, next) {
  try {
    const allowedFields = ['name', 'phone', 'department'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
}
