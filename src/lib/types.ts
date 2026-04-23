export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  INTERESTED = 'interested',
  NEGOTIATING = 'negotiating',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export enum LeadPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ActivityAction {
  LEAD_CREATED = 'lead_created',
  LEAD_ASSIGNED = 'lead_assigned',
  LEAD_REASSIGNED = 'lead_reassigned',
  STATUS_UPDATED = 'status_updated',
  NOTES_UPDATED = 'notes_updated',
  FOLLOWUP_SET = 'followup_set',
  CONTACT_ATTEMPTED = 'contact_attempted',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  budget: number;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  notes: string;
  assignedTo?: string;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Activity {
  _id: string;
  leadId: string;
  action: ActivityAction;
  performedBy: string;
  details: any;
  createdAt: Date;
}
