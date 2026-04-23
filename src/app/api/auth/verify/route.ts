import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
