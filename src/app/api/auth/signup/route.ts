import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20));
    
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

    console.log('About to query database...');

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Rest of your signup logic...
    
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}