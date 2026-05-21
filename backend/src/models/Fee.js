import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Partial', 'Paid', 'Overdue'], default: 'Pending' },
    category: { type: String, default: 'Tuition' },
    transactionId: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Fee', feeSchema);
