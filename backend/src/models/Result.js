import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    marks: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, default: 100, min: 1 },
    grade: { type: String, default: '' }
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    examName: { type: String, required: true },
    semester: { type: Number, required: true },
    subjects: [subjectSchema],
    gpa: { type: Number, default: 0 },
    status: { type: String, enum: ['Pass', 'Fail', 'Pending'], default: 'Pending' },
    publishedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Result', resultSchema);
