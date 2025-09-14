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

    // Calculate date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Get all recent jobs first, then filter in JavaScript for better compatibility
    const allRecentJobs = await prisma.job.findMany({
      where: {
        active: true,
        postedAt: {
          gte: threeDaysAgo
        }
      },
      orderBy: {
        postedAt: 'desc'
      }
    });

    // Filter for US locations in JavaScript
    const jobs = allRecentJobs.filter(job => {
      if (!job.location) return false;
      const location = job.location.toLowerCase();
      
      const includePatterns = [
        'united states', 'usa', 'us,', ', us', 'remote', 'anywhere',
        'california', 'new york', 'texas', 'florida', 'washington', 'oregon',
        'colorado', 'massachusetts', 'illinois', 'north carolina', 'georgia',
        'virginia', 'arizona', 'tennessee', 'nevada', 'utah'
      ];
      
      const excludePatterns = [
        'canada', 'united kingdom', 'uk,', ', uk', 'germany', 'france',
        'italy', 'spain', 'netherlands', 'poland', 'australia', 'new zealand',
        'india', 'singapore', 'brazil', 'mexico'
      ];
      
      const hasUSIndicator = includePatterns.some(pattern => location.includes(pattern));
      const hasNonUSIndicator = excludePatterns.some(pattern => location.includes(pattern));
      
      return hasUSIndicator && !hasNonUSIndicator;
    });

    const latestJob = await prisma.job.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true }
    });

    return NextResponse.json({ 
      jobs,
      count: jobs.length,
      lastIngestionTime: latestJob?.updatedAt || null,
      filterDate: threeDaysAgo
    });

  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch recent jobs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/db');

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const totalJobs = await prisma.job.count({ where: { active: true } });
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const recentJobs = await prisma.job.count({ 
      where: { 
        active: true,
        postedAt: { gte: threeDaysAgo }
      } 
    });

    const companiesWithJobs = await prisma.job.groupBy({
      by: ['company'],
      where: { 
        active: true,
        postedAt: { gte: threeDaysAgo }
      },
      _count: { id: true }
    });

    return NextResponse.json({
      totalJobs,
      recentJobs,
      activeCompanies: companiesWithJobs.length,
      topCompanies: companiesWithJobs
        .sort((a, b) => b._count.id - a._count.id)
        .slice(0, 10)
        .map(c => ({ company: c.company, jobCount: c._count.id }))
    });

  } catch (error) {
    console.error('Error fetching job stats:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch job statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}