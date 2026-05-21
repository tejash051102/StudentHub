import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['Exam', 'Event', 'Deadline', 'Meeting'], default: 'Event' },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, default: null },
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
