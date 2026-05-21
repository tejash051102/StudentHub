import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    enrollmentYear: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' },
    address: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

studentSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  rollNumber: 'text',
  department: 'text',
  course: 'text'
});

export default mongoose.model('Student', studentSchema);
