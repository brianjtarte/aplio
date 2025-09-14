import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Dynamic imports
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/db');

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: user.profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Dynamic imports
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/db');

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { headline, location, salaryMin, salaryMax, summary } = body;

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        headline: headline || null,
        location: location || null,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        summary: summary || null,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        headline: headline || null,
        location: location || null,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        summary: summary || null,
      },
    });

    return NextResponse.json({ 
      message: 'Profile saved successfully',
      profile 
    });
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}