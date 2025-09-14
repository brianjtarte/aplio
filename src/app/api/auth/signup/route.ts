import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    // Add environment check
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, password } = signUpSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with initial plan
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        plan: {
          create: {
            tier: 'FREE',
            appsPerMonth: 10,
            renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign up error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }

    // More specific database error handling
    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a GET handler to prevent build-time execution
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}