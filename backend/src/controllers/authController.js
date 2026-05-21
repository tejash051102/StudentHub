import User from '../models/User.js';
import { signToken } from '../utils/token.js';

function authResponse(user) {
  return {
    token: signToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollmentNumber: user.enrollmentNumber,
      phone: user.phone,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      department: user.department,
      course: user.course,
      semester: user.semester,
      address: user.address,
      profilePhoto: user.profilePhoto,
      isEmailVerified: user.isEmailVerified
    }
  };
}

export async function register(req, res, next) {
  try {
    const {
      name,
      enrollmentNumber,
      email,
      password,
      confirmPassword,
      role,
      phone,
      gender,
      dateOfBirth,
      department,
      course,
      semester,
      address,
      acceptedTerms
    } = req.body;

    if (!name || !enrollmentNumber || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Full name, enrollment number, email, phone, and password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (acceptedTerms !== 'true' && acceptedTerms !== true) {
      return res.status(400).json({ message: 'Please accept the terms and conditions' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const user = await User.create({
      name,
      enrollmentNumber,
      email,
      password,
      role: role || 'student',
      phone,
      gender,
      dateOfBirth: dateOfBirth || null,
      department,
      course,
      semester,
      address,
      acceptedTerms: true,
      profilePhoto: req.file ? `/uploads/profiles/${req.file.filename}` : '',
      isEmailVerified: true
    });
    res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isLocked() || !(await user.matchPassword(password))) {
      if (user && !user.isLocked()) {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        await user.save();
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();
    await user.save();
    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
}
