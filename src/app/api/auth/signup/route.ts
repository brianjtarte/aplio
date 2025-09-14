import { NextRequest, NextResponse } from 'next/server';

// Move all imports inside the function to avoid build-time execution
export async function POST(request: NextRequest) {
  try {
    // Import dependencies only when actually needed
    const bcrypt = await import('bcryptjs');
    const { z } = await import('zod');
    const { prisma } = await import('@/lib/db');

    // Check environment
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 500 }
      );
    }

    const signUpSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });

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
            renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
    
    const { z } = await import('zod');
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}