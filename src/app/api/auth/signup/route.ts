import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/password';
import { createToken } from '@/lib/jwt';
import { signupSchema } from '@/lib/validators';
import { validateBody } from '@/middleware/validation';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const validation = await validateBody(req, signupSchema);
    if (!validation.valid) {
      return validation.error!;
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'agent', // Default role is agent
    });

    // Create JWT token
    const token = await createToken(
      { id: user._id, email: user.email, role: user.role },
      '7d'
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
