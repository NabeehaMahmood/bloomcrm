import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import { withAuth } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { updateLeadStatusSchema } from '@/lib/validators';
import { ActivityAction } from '@/lib/types';

async function getLeadHandler(req: NextRequest, user: any, params: any) {
  const { id } = params;

  const lead = await Lead.findById(id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Check authorization
  if (user.role === 'agent' && lead.assignedTo?.toString() !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Get activity history
  const activities = await Activity.find({ leadId: id })
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    lead,
    activities,
  });
}

async function updateLeadHandler(req: NextRequest, user: any, params: any) {
  const { id } = params;

  const lead = await Lead.findById(id);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Check authorization
  if (
    user.role === 'agent' &&
    lead.assignedTo?.toString() !== user.id &&
    lead.createdBy.toString() !== user.id
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();

  // Track what changed
  const changes: any = {};

  if (body.status && body.status !== lead.status) {
    changes.oldStatus = lead.status;
    changes.newStatus = body.status;
    lead.status = body.status;

    // Log activity
    await Activity.create({
      leadId: id,
      action: ActivityAction.STATUS_UPDATED,
      performedBy: user.id,
      details: changes,
    });
  }

  if (body.notes && body.notes !== lead.notes) {
    changes.oldNotes = lead.notes;
    changes.newNotes = body.notes;
    lead.notes = body.notes;

    // Log activity
    await Activity.create({
      leadId: id,
      action: ActivityAction.NOTES_UPDATED,
      performedBy: user.id,
      details: changes,
    });
  }

  if (body.nextFollowUp) {
    lead.nextFollowUp = new Date(body.nextFollowUp);

    // Log activity
    await Activity.create({
      leadId: id,
      action: ActivityAction.FOLLOWUP_SET,
      performedBy: user.id,
      details: { followupDate: body.nextFollowUp },
    });
  }

  lead.lastActivity = new Date();
  await lead.save();

  return NextResponse.json({
    success: true,
    message: 'Lead updated successfully',
    lead,
  });
}

async function deleteLeadHandler(req: NextRequest, user: any, params: any) {
  const { id } = params;

  // Only admin can delete leads
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Delete associated activities
  await Activity.deleteMany({ leadId: id });

  return NextResponse.json({
    success: true,
    message: 'Lead deleted successfully',
  });
}

export async function GET(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    return withAuth(req, (r, u) => getLeadHandler(r, u, params));
  } catch (error: any) {
    console.error('Get lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    return withAuth(req, (r, u) => updateLeadHandler(r, u, params));
  } catch (error: any) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    return withAuth(req, (r, u) => deleteLeadHandler(r, u, params));
  } catch (error: any) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
