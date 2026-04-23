import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return handler(req, user);
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

export async function withAdminAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await verifyToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    return handler(req, user);
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
