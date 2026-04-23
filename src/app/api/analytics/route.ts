import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { withAdminAuth } from '@/middleware/auth';

async function getAnalyticsHandler(req: NextRequest, user: any) {
  // Total leads count
  const totalLeads = await Lead.countDocuments();

  // Leads by status
  const leadsByStatus = await Lead.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Leads by priority
  const leadsByPriority = await Lead.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  // Agent performance
  const agents = await User.find({ role: 'agent' });
  const agentPerformance = await Promise.all(
    agents.map(async (agent) => {
      const assignedLeads = await Lead.countDocuments({ assignedTo: agent._id });
      const closedLeads = await Lead.countDocuments({
        assignedTo: agent._id,
        status: { $in: ['closed_won', 'closed_lost'] },
      });

      return {
        agentId: agent._id,
        agentName: agent.name,
        agentEmail: agent.email,
        totalAssigned: assignedLeads,
        totalClosed: closedLeads,
        closureRate:
          assignedLeads > 0
            ? ((closedLeads / assignedLeads) * 100).toFixed(2)
            : 0,
      };
    })
  );

  return NextResponse.json({
    success: true,
    analytics: {
      totalLeads,
      leadsByStatus,
      leadsByPriority,
      agentPerformance,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    return withAdminAuth(req, getAnalyticsHandler);
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
