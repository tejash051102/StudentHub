import User from '../models/User.js';
import { logActivity } from '../utils/activity.js';

export async function getPendingUsers(req, res, next) {
  try {
    const users = await User.find({ role: 'student', approvalStatus: 'pending' })
      .select('-password -refreshToken -resetOtp')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function updateApproval(req, res, next) {
  try {
    const { status, rejectionReason = '' } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Approval status must be approved or rejected' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: status,
        rejectionReason: status === 'rejected' ? rejectionReason : '',
        approvedBy: status === 'approved' ? req.user._id : null,
        approvedAt: status === 'approved' ? new Date() : null
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -resetOtp');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logActivity(req.user._id, `${status} student registration`, 'User', { userId: user._id });
    res.json(user);
  } catch (error) {
    next(error);
  }
}
