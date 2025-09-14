import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'DATABASE_URL not configured' },
        { status: 500 }
      );
    }

    const bcrypt = await import('bcryptjs');
    const { z } = await import('zod');
    const { prisma } = await import('@/lib/db');

    const signUpSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const body = await request.json();
    const { name, email, password } = signUpSchema.parse(body);

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

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
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
      { message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}