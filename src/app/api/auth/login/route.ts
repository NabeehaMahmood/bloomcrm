import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePasswords } from '@/lib/password';
import { createToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validators';
import { validateBody } from '@/middleware/validation';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const validation = await validateBody(req, loginSchema);
    if (!validation.valid) {
      return validation.error!;
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordCorrect = await comparePasswords(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken(
      { id: user._id, email: user.email, role: user.role },
      '7d'
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
