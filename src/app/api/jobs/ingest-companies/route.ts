// src/app/api/jobs/ingest-companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { fetchJobsFromMultipleCompanies } from '@/lib/company-job-api';
import * as fs from 'fs';
import * as path from 'path';

interface CompanyJobBoard {
  company: string;
  provider: string;
  token: string;
  jobsCount: number;
  endpointURL: string;
}

function parseCompaniesFromCSV(): CompanyJobBoard[] {
  try {
    // Read CSV from data directory
    const csvPath = path.join(process.cwd(), 'src', 'data', 'companies.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error('companies.csv not found in src/data/ directory');
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Find column indices (case insensitive)
    const companyIndex = headers.findIndex(h => h.toLowerCase().includes('company'));
    const providerIndex = headers.findIndex(h => h.toLowerCase().includes('provider'));
    const tokenIndex = headers.findIndex(h => h.toLowerCase().includes('token') || h.toLowerCase().includes('slug'));
    const jobsCountIndex = headers.findIndex(h => h.toLowerCase().includes('jobscount') || h.toLowerCase().includes('count'));
    const endpointIndex = headers.findIndex(h => h.toLowerCase().includes('endpoint') || h.toLowerCase().includes('url'));

    console.log('CSV Headers mapping:', { companyIndex, providerIndex, tokenIndex, jobsCountIndex, endpointIndex });

    if (companyIndex === -1 || providerIndex === -1 || endpointIndex === -1) {
      throw new Error('Required columns not found. Need: Company, Provider, EndpointURL');
    }

    const companies: CompanyJobBoard[] = [];

    // Parse data rows (skip header)
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

        // Only add companies with valid data and working endpoints
        if (company.company && company.provider && company.endpointURL && company.endpointURL !== 'undefined') {
          companies.push(company);
        }
      }
    }

    console.log(`Loaded ${companies.length} companies from CSV`);
    return companies;
  } catch (error) {
    console.error('Error reading companies CSV:', error);
    throw error;
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { providers = ['greenhouse', 'lever', 'ashby'], maxCompanies = 0 } = body;

    console.log(`Starting company job ingestion...`);
    console.log(`Filters: providers=${providers.join(',')}, maxCompanies=${maxCompanies}`);

    // Load companies from CSV file
    const allCompanies = parseCompaniesFromCSV();
    
    // Filter by providers
    const filteredCompanies = allCompanies.filter(company => 
      providers.some((provider: string) => 
        company.provider.toLowerCase() === provider.toLowerCase()
      )
    );

    // Limit number of companies if specified
    const companiesToProcess = maxCompanies > 0 
      ? filteredCompanies.slice(0, maxCompanies)
      : filteredCompanies;

    console.log(`Processing ${companiesToProcess.length} companies (filtered from ${allCompanies.length} total)`);

    // Fetch jobs from companies
    const jobs = await fetchJobsFromMultipleCompanies(companiesToProcess);
    
    let newJobs = 0;
    let updatedJobs = 0;
    let errors = 0;

    // Upsert jobs to database
    for (const job of jobs) {
      try {
        // Check if job already exists
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
          updatedJobs++;
        } else {
          newJobs++;
        }
      } catch (dbError) {
        console.error(`Error upserting job ${job.sourceJobId}:`, dbError);
        errors++;
      }
    }

    // Generate provider stats
    const providerStats = companiesToProcess.reduce((acc, company) => {
      acc[company.provider] = (acc[company.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({ 
      message: `Successfully processed ${jobs.length} jobs from ${companiesToProcess.length} companies`,
      totalJobs: jobs.length,
      newJobs,
      updatedJobs,
      errors,
      companiesProcessed: companiesToProcess.length,
      companiesAvailable: allCompanies.length,
      providerStats,
      filters: { providers, maxCompanies }
    });

  } catch (error) {
    console.error('Company job ingestion error:', error);
    return NextResponse.json({ 
      message: 'Failed to ingest company jobs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to show CSV stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const companies = parseCompaniesFromCSV();
    
    // Generate stats
    const providerStats = companies.reduce((acc, company) => {
      acc[company.provider] = (acc[company.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCompanies = companies
      .sort((a, b) => b.jobsCount - a.jobsCount)
      .slice(0, 10);

    return NextResponse.json({
      totalCompanies: companies.length,
      providerStats,
      topCompanies: topCompanies.map(c => ({ 
        company: c.company, 
        provider: c.provider, 
        jobsCount: c.jobsCount 
      })),
      supportedProviders: ['greenhouse', 'lever', 'ashby']
    });

  } catch (error) {
    console.error('Error fetching company stats:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch company statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}