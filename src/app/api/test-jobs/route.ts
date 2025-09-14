import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/db');

    // Get basic job statistics
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({ where: { active: true } });
    
    // Get a few sample jobs
    const sampleJobs = await prisma.job.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        postedAt: true,
        active: true
      }
    });

    // Get recent job count (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const recentJobs = await prisma.job.count({
      where: {
        active: true,
        postedAt: { gte: threeDaysAgo }
      }
    });

    return NextResponse.json({
      totalJobs,
      activeJobs,
      recentJobs,
      sampleJobs,
      databaseConnected: true
    });

  } catch (error) {
    console.error('Test jobs error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseConnected: false
    }, { status: 500 });
  }
}