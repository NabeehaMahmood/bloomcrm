import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAdminAuth } from '@/middleware/auth';

async function getAgentsHandler(req: NextRequest, user: any) {
  const agents = await User.find({ role: 'agent' }).select('-password');

  return NextResponse.json({
    success: true,
    agents,
  });
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    return withAdminAuth(req, getAgentsHandler);
  } catch (error: any) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
