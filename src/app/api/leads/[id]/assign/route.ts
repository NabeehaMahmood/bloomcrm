import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import { withAdminAuth } from '@/middleware/auth';
import { ActivityAction } from '@/lib/types';

async function assignLeadHandler(req: NextRequest, user: any, params: any) {
  const { id } = params;
  const { agentId } = await req.json();

  if (!agentId) {
    return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
  }

  const lead = await Lead.findById(id);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const previousAssignment = lead.assignedTo;
  lead.assignedTo = agentId;
  await lead.save();

  // Log activity
  const action = previousAssignment
    ? ActivityAction.LEAD_REASSIGNED
    : ActivityAction.LEAD_ASSIGNED;

  await Activity.create({
    leadId: id,
    action,
    performedBy: user.id,
    details: {
      previousAgent: previousAssignment,
      newAgent: agentId,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Lead assigned successfully',
    lead: await lead.populate('assignedTo', 'name email'),
  });
}

export async function POST(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    return withAdminAuth(req, (r, u) => assignLeadHandler(r, u, params));
  } catch (error: any) {
    console.error('Assign lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assign lead' },
      { status: 500 }
    );
  }
}
