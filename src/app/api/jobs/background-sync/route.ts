import { NextRequest, NextResponse } from 'next/server';

interface CompanyJobBoard {
  company: string;
  provider: string;
  token: string;
  jobsCount: number;
  endpointURL: string;
}

async function parseCompaniesFromCSV(): Promise<CompanyJobBoard[]> {
  const fs = await import('fs');
  const path = await import('path');
  
  try {
    // Debug logging
    console.log('Current working directory:', process.cwd());
    
    // Check what's in the root directory
    try {
      const rootFiles = fs.readdirSync(process.cwd());
      console.log('Files in root directory:', rootFiles);
    } catch (rootError) {
      console.log('Could not read root directory:', rootError);
    }
    
    // Check what's in the public directory
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const publicFiles = fs.readdirSync(publicDir);
      console.log('Files in public directory:', publicFiles);
    } catch (publicError) {
      console.log('Could not read public directory:', publicError);
    }
    
    const csvPath = path.join(process.cwd(), 'companies.csv');
    console.log('Looking for CSV at:', csvPath);
    console.log('CSV file exists:', fs.existsSync(csvPath));
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`companies.csv not found at ${csvPath}`);
    }

    // Rest of your existing CSV parsing code...
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // ... continue with your existing parsing logic
    
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const companyIndex = headers.findIndex(h => h.toLowerCase().includes('company'));
    const providerIndex = headers.findIndex(h => h.toLowerCase().includes('provider'));
    const tokenIndex = headers.findIndex(h => h.toLowerCase().includes('token') || h.toLowerCase().includes('slug'));
    const jobsCountIndex = headers.findIndex(h => h.toLowerCase().includes('jobscount') || h.toLowerCase().includes('count'));
    const endpointIndex = headers.findIndex(h => h.toLowerCase().includes('endpoint') || h.toLowerCase().includes('url'));

    if (companyIndex === -1 || providerIndex === -1 || endpointIndex === -1) {
      throw new Error('Required columns not found. Need: Company, Provider, EndpointURL');
    }

    const companies: CompanyJobBoard[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = parseCSVLine(line);
      
      if (columns.length > Math.max(companyIndex, providerIndex, endpointIndex)) {
        const company: CompanyJobBoard = {
          company: cleanCSVField(columns[companyIndex]) || '',
          provider: cleanCSVField(columns[providerIndex]) || '',
          token: cleanCSVField(columns[tokenIndex]) || '',
          jobsCount: parseInt(cleanCSVField(columns[jobsCountIndex])) || 0,
          endpointURL: cleanCSVField(columns[endpointIndex]) || ''
        };

        if (company.company && company.provider && company.endpointURL && company.endpointURL !== 'undefined') {
          companies.push(company);
        }
      }
    }

    return companies;
  } catch (error) {
    console.error('Error reading companies CSV:', error);
    
    // Fallback to test companies for now
    console.log('Using fallback test companies...');
    return [
      {
        company: "Stripe",
        provider: "greenhouse",
        token: "stripe",
        jobsCount: 50,
        endpointURL: "https://api.greenhouse.io/v1/boards/stripe/jobs"
      },
      {
        company: "Airbnb", 
        provider: "greenhouse",
        token: "airbnb",
        jobsCount: 30,
        endpointURL: "https://api.greenhouse.io/v1/boards/airbnb/jobs"
      },
      {
        company: "Coinbase",
        provider: "greenhouse", 
        token: "coinbase",
        jobsCount: 25,
        endpointURL: "https://api.greenhouse.io/v1/boards/coinbase/jobs"
      }
    ];
  }
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function cleanCSVField(field: string): string {
  return field ? field.replace(/^"|"$/g, '').trim() : '';
}

export async function POST(request: NextRequest) {
  try {
    // Dynamic imports
    const { prisma } = await import('@/lib/db');
    const { fetchJobsFromMultipleCompanies } = await import('@/lib/company-job-api');

    // Verify this is a legitimate background job call
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.BACKGROUND_JOB_SECRET || 'your-secret-token';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting background job sync...');
    const startTime = new Date();

    // Load companies from CSV
    const allCompanies = await parseCompaniesFromCSV();
    console.log(`Loaded ${allCompanies.length} companies from CSV`);

    // Process in smaller batches to avoid overwhelming APIs
    const batchSize = 20;
    let totalNewJobs = 0;
    let totalUpdatedJobs = 0;
    let successfulCompanies = 0;
    let failedCompanies = 0;

    for (let i = 0; i < allCompanies.length; i += batchSize) {
      const batch = allCompanies.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allCompanies.length / batchSize)}`);

      try {
        const jobs = await fetchJobsFromMultipleCompanies(batch);
        
        for (const job of jobs) {
          try {
            const existingJob = await prisma.job.findUnique({
              where: { sourceJobId: job.sourceJobId }
            });

            await prisma.job.upsert({
              where: { sourceJobId: job.sourceJobId },
              update: {
                ...job,
                updatedAt: new Date(),
              },
              create: {
                ...job,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });

            if (existingJob) {
              totalUpdatedJobs++;
            } else {
              totalNewJobs++;
            }
          } catch (dbError) {
            console.error(`Error upserting job ${job.sourceJobId}:`, dbError);
          }
        }

        successfulCompanies += batch.length;
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (batchError) {
        console.error(`Error processing batch starting at index ${i}:`, batchError);
        failedCompanies += batch.length;
      }
    }

    // Clean up old jobs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const deletedJobs = await prisma.job.deleteMany({
      where: {
        postedAt: {
          lt: sevenDaysAgo
        }
      }
    });

    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    return NextResponse.json({
      success: true,
      message: `Background sync completed successfully`,
      stats: {
        totalCompanies: allCompanies.length,
        successfulCompanies,
        failedCompanies,
        newJobs: totalNewJobs,
        updatedJobs: totalUpdatedJobs,
        deletedOldJobs: deletedJobs.count,
        durationMinutes,
        startTime,
        endTime
      }
    });

  } catch (error) {
    console.error('Background job sync error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Background sync failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { prisma } = await import('@/lib/db');
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const recentJobCount = await prisma.job.count({
      where: {
        active: true,
        postedAt: { gte: threeDaysAgo }
      }
    });

    const totalJobCount = await prisma.job.count({
      where: { active: true }
    });

    const latestJob = await prisma.job.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true, company: true, title: true }
    });

    return NextResponse.json({
      status: 'healthy',
      recentJobs: recentJobCount,
      totalJobs: totalJobCount,
      lastJobUpdate: latestJob?.updatedAt,
      lastJobFrom: latestJob?.company,
      lastJobTitle: latestJob?.title
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}