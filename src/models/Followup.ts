import mongoose from 'mongoose';

const followupSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      unique: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followupDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Followup || mongoose.model('Followup', followupSchema);
