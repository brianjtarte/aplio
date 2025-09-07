import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const { jobIds } = body;

    if (!jobIds || !Array.isArray(jobIds)) {
      return NextResponse.json(
        { message: 'Invalid job IDs' },
        { status: 400 }
      );
    }

    // Check for existing applications
    const existingApplications = await prisma.application.findMany({
      where: {
        userId: user.id,
        jobId: { in: jobIds },
      },
    });

    const existingJobIds = existingApplications.map(app => app.jobId);
    const newJobIds = jobIds.filter(id => !existingJobIds.includes(id));

    if (newJobIds.length === 0) {
      return NextResponse.json(
        { message: 'All selected jobs have already been applied to' },
        { status: 400 }
      );
    }

    // Create applications for new jobs
    const applications = await prisma.application.createMany({
      data: newJobIds.map(jobId => ({
        userId: user.id,
        jobId,
        status: 'APPLIED',
        autopilot: false,
        appliedAt: new Date(),
      })),
    });

    return NextResponse.json({
      message: `Applied to ${applications.count} jobs successfully!`,
      applied: applications.count,
      skipped: existingJobIds.length,
    });
  } catch (error) {
    console.error('Apply to jobs error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}