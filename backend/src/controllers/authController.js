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
      phone: user.phone,
      department: user.department
    }
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role, phone, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password, role, phone, department });
    res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
}
