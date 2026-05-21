import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'faculty', 'clerk', 'student'], default: 'student' },
    enrollmentNumber: { type: String, trim: true, default: '' },
    phone: { type: String, default: '' },
    gender: { type: String, enum: ['', 'Male', 'Female', 'Other', 'Prefer not to say'], default: '' },
    dateOfBirth: { type: Date, default: null },
    department: { type: String, default: '' },
    course: { type: String, default: '' },
    semester: { type: String, default: '' },
    address: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    acceptedTerms: { type: Boolean, default: false },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    refreshToken: { type: String, default: '' },
    resetOtp: { type: String, default: '' },
    resetOtpExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.isLocked = function isLocked() {
  return this.lockUntil && this.lockUntil > new Date();
};

export default mongoose.model('User', userSchema);
