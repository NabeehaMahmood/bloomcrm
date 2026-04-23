import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  propertyInterest: z.string().min(3, 'Property interest is required'),
  budget: z.number().min(0, 'Budget must be positive'),
  notes: z.string().optional(),
  status: z.enum(['new', 'contacted', 'interested', 'negotiating', 'closed_won', 'closed_lost']),
});

export const assignLeadSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'interested', 'negotiating', 'closed_won', 'closed_lost']),
});

export const setFollowupSchema = z.object({
  followupDate: z.string().datetime('Invalid date format'),
});
