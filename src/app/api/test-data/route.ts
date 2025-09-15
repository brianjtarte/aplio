import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/db');
    
    const testJobs = [
      {
        source: 'test',
        sourceJobId: 'test-job-1',
        title: 'Senior Software Engineer',
        company: 'Test Company',
        location: 'San Francisco, CA',
        mode: 'HYBRID',
        level: 'SENIOR',
        category: 'Engineering',
        salary: '$120k - $180k',
        salaryMin: 120000,
        salaryMax: 180000,
        postedAt: new Date(),
        url: 'https://example.com/job/1',
        description: 'Test job description for senior engineer',
        skills: 'JavaScript, React, Node.js',
        active: true
      },
      {
        source: 'test',
        sourceJobId: 'test-job-2',
        title: 'Product Manager',
        company: 'Another Test Co',
        location: 'Remote',
        mode: 'REMOTE',
        level: 'MID',
        category: 'Product',
        postedAt: new Date(),
        url: 'https://example.com/job/2',
        description: 'Test PM role',
        skills: 'Product Strategy, Analytics',
        active: true
      }
    ];

    for (const job of testJobs) {
      await prisma.job.upsert({
        where: { sourceJobId: job.sourceJobId },
        update: job,
        create: job
      });
    }

    return NextResponse.json({ 
      message: 'Test jobs created successfully',
      jobsCreated: testJobs.length 
    });

  } catch (error) {
    console.error('Test data creation error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}