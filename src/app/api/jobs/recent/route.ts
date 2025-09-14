import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/db');

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Calculate date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

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

    // Filter for US locations
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

    return NextResponse.json({ 
      jobs,
      count: jobs.length,
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