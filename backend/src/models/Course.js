import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1 },
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
