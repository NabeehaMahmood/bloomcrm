import mongoose from 'mongoose';
import { ActivityAction } from '@/lib/types';

const activitySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    action: {
      type: String,
      enum: [
        ActivityAction.LEAD_CREATED,
        ActivityAction.LEAD_ASSIGNED,
        ActivityAction.LEAD_REASSIGNED,
        ActivityAction.STATUS_UPDATED,
        ActivityAction.NOTES_UPDATED,
        ActivityAction.FOLLOWUP_SET,
        ActivityAction.CONTACT_ATTEMPTED,
      ],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
