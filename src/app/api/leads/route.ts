import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import { withAuth } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { leadSchema } from '@/lib/validators';
import { ActivityAction } from '@/lib/types';

async function createLeadHandler(req: NextRequest, user: any) {
  const validation = await validateBody(req, leadSchema);
  if (!validation.valid) {
    return validation.error!;
  }

  const { name, email, phone, propertyInterest, budget, status, notes } =
    validation.data;

  const lead = await Lead.create({
    name,
    email,
    phone,
    propertyInterest,
    budget,
    status,
    notes,
    createdBy: user.id,
  });

  // Log activity
  await Activity.create({
    leadId: lead._id,
    action: ActivityAction.LEAD_CREATED,
    performedBy: user.id,
    details: { leadId: lead._id },
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Lead created successfully',
      lead,
    },
    { status: 201 }
  );
}

async function getLeadsHandler(req: NextRequest, user: any) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const query: any = {};

  // Filter by role
  if (user.role === 'agent') {
    query.assignedTo = user.id;
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;

  const leads = await Lead.find(query)
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Lead.countDocuments(query);

  return NextResponse.json({
    success: true,
    leads,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    return withAuth(req, createLeadHandler);
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    return withAuth(req, getLeadsHandler);
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
