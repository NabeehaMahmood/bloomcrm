import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

const LIMITS = {
  agent: 50, // 50 requests per minute
  admin: Infinity, // No limit
  default: 100,
};

const WINDOW_MS = 60 * 1000; // 1 minute

function getClientIdentifier(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function withRateLimit(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    const authHeader = req.headers.get('authorization');
    let user = null;
    let limit = LIMITS.default;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      user = await verifyToken(token);

      if (user) {
        limit = user.role === 'admin' ? LIMITS.admin : LIMITS.agent;
      }
    }

    // Skip rate limiting for admin
    if (limit === Infinity) {
      return handler(req, user);
    }

    const clientId = getClientIdentifier(req);
    const now = Date.now();
    const record = requestCounts.get(clientId);

    if (!record || now > record.resetTime) {
      requestCounts.set(clientId, {
        count: 1,
        resetTime: now + WINDOW_MS,
      });
      return handler(req, user);
    }

    if (record.count >= limit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    record.count++;
    return handler(req, user);
  } catch (error) {
    return NextResponse.json({ error: 'Rate limiting error' }, { status: 500 });
  }
}
