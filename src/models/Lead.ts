import mongoose from 'mongoose';
import { LeadStatus, LeadPriority } from '@/lib/types';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    propertyInterest: {
      type: String,
      required: [true, 'Property interest is required'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: [
        LeadStatus.NEW,
        LeadStatus.CONTACTED,
        LeadStatus.INTERESTED,
        LeadStatus.NEGOTIATING,
        LeadStatus.CLOSED_WON,
        LeadStatus.CLOSED_LOST,
      ],
      default: LeadStatus.NEW,
    },
    priority: {
      type: String,
      enum: [LeadPriority.HIGH, LeadPriority.MEDIUM, LeadPriority.LOW],
      default: LeadPriority.LOW,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    nextFollowUp: {
      type: Date,
      default: null,
    },
    lastActivity: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Calculate priority based on budget before saving
leadSchema.pre('save', function (next) {
  if (this.budget > 20000000) {
    this.priority = LeadPriority.HIGH;
    this.score = 90;
  } else if (this.budget >= 10000000) {
    this.priority = LeadPriority.MEDIUM;
    this.score = 70;
  } else {
    this.priority = LeadPriority.LOW;
    this.score = 50;
  }
  next();
});

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
