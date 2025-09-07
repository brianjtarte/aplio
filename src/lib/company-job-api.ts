// src/lib/company-job-api.ts

interface CompanyJobBoard {
  company: string;
  provider: string;
  token: string;
  jobsCount: number;
  endpointURL: string;
}

export async function fetchJobsFromCompany(company: CompanyJobBoard) {
  console.log(`Fetching jobs from ${company.company} via ${company.provider}`);
  
  switch (company.provider.toLowerCase()) {
    case 'greenhouse':
      return await fetchGreenhouseJobs(company);
    case 'lever':
      return await fetchLeverJobs(company);
    case 'ashby':
      return await fetchAshbyJobs(company);
    default:
      console.warn(`Unknown provider: ${company.provider}`);
      return [];
  }
}

// Greenhouse API Integration
async function fetchGreenhouseJobs(company: CompanyJobBoard) {
  try {
    const response = await fetch(company.endpointURL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Aplio-Bot/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Greenhouse API error: ${response.status}`);
    }

    const data = await response.json();
    return normalizeGreenhouseJobs(data.jobs || [], company.company);
  } catch (error) {
    console.error(`Error fetching from ${company.company}:`, error);
    return [];
  }
}

// Lever API Integration  
async function fetchLeverJobs(company: CompanyJobBoard) {
  try {
    const response = await fetch(company.endpointURL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Aplio-Bot/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Lever API error: ${response.status}`);
    }

    const data = await response.json();
    return normalizeLeverJobs(data, company.company);
  } catch (error) {
    console.error(`Error fetching from ${company.company}:`, error);
    return [];
  }
}

// Ashby API Integration
async function fetchAshbyJobs(company: CompanyJobBoard) {
  try {
    const response = await fetch(company.endpointURL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Aplio-Bot/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Ashby API error: ${response.status}`);
    }

    const data = await response.json();
    return normalizeAshbyJobs(data.jobs || [], company.company);
  } catch (error) {
    console.error(`Error fetching from ${company.company}:`, error);
    return [];
  }
}

// Normalize Greenhouse job data
function normalizeGreenhouseJobs(jobs: any[], companyName: string) {
  return jobs
    .filter(job => !job.internal) // Filter out internal positions
    .map(job => ({
      source: 'Greenhouse',
      sourceJobId: `greenhouse-${job.id}`,
      title: job.title,
      company: companyName,
      location: job.location?.name || 'Remote',
      mode: determineWorkMode(job.location?.name),
      level: mapExperienceLevel(job.title),
      category: mapJobCategory(job.title),
      salary: 'Not specified',
      salaryMin: null,
      salaryMax: null,
      postedAt: new Date(job.updated_at || Date.now()),
      url: job.absolute_url,
      description: job.content || '',
      requirements: job.content || '',
      skills: extractSkillsFromDescription(job.content || ''),
      active: true,
    }));
}

// Normalize Lever job data
function normalizeLeverJobs(jobs: any[], companyName: string) {
  return jobs.map((job: any) => ({
    source: 'Lever',
    sourceJobId: `lever-${job.id}`,
    title: job.text,
    company: companyName,
    location: job.categories?.location || 'Remote',
    mode: determineWorkMode(job.categories?.location),
    level: mapExperienceLevel(job.text),
    category: mapJobCategory(job.text),
    salary: 'Not specified',
    salaryMin: null,
    salaryMax: null,
    postedAt: new Date(job.createdAt || Date.now()),
    url: job.hostedUrl,
    description: job.description || '',
    requirements: job.lists?.find((list: any) => list.text.includes('Requirements'))?.content || '',
    skills: extractSkillsFromDescription(job.description || ''),
    active: true,
  }));
}

// Normalize Ashby job data
function normalizeAshbyJobs(jobs: any[], companyName: string) {
  return jobs.map((job: any) => ({
    source: 'Ashby',
    sourceJobId: `ashby-${job.id}`,
    title: job.title,
    company: companyName,
    location: job.locationName || 'Remote',
    mode: determineWorkMode(job.locationName),
    level: mapExperienceLevel(job.title),
    category: mapJobCategory(job.title),
    salary: 'Not specified',
    salaryMin: null,
    salaryMax: null,
    postedAt: new Date(job.publishedAt || Date.now()),
    url: job.jobUrl,
    description: job.descriptionHtml || '',
    requirements: job.descriptionHtml || '',
    skills: extractSkillsFromDescription(job.descriptionHtml || ''),
    active: true,
  }));
}

// Helper functions
function determineWorkMode(location?: string): string {
  if (!location) return 'REMOTE';
  const locationLower = location.toLowerCase();
  if (locationLower.includes('remote') || locationLower.includes('anywhere')) {
    return 'REMOTE';
  }
  if (locationLower.includes('hybrid')) {
    return 'HYBRID';
  }
  return 'ON_SITE';
}

function mapExperienceLevel(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
    return 'SENIOR';
  }
  if (titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('graduate')) {
    return 'ENTRY';
  }
  return 'MID';
}

function mapJobCategory(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('engineer') || titleLower.includes('developer') || titleLower.includes('swe')) {
    return 'Engineering';
  }
  if (titleLower.includes('design') || titleLower.includes('ux') || titleLower.includes('ui')) {
    return 'Design';
  }
  if (titleLower.includes('product') || titleLower.includes('pm')) {
    return 'Product';
  }
  if (titleLower.includes('marketing')) {
    return 'Marketing';
  }
  if (titleLower.includes('sales') || titleLower.includes('account')) {
    return 'Sales';
  }
  if (titleLower.includes('data') || titleLower.includes('analyst') || titleLower.includes('scientist')) {
    return 'Data';
  }
  return 'Other';
}

function extractSkillsFromDescription(description: string): string {
  // Simple skill extraction - can be enhanced with NLP
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
    'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST',
    'Git', 'Agile', 'Scrum', 'CI/CD', 'TDD', 'Microservices'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.join(',');
}

// Bulk company job fetching
export async function fetchJobsFromMultipleCompanies(companies: CompanyJobBoard[], limit?: number) {
  const allJobs = [];
  const companiesToProcess = limit ? companies.slice(0, limit) : companies;
  
  console.log(`Fetching jobs from ${companiesToProcess.length} companies...`);
  
  for (const company of companiesToProcess) {
    try {
      const jobs = await fetchJobsFromCompany(company);
      allJobs.push(...jobs);
      console.log(`✅ ${company.company}: ${jobs.length} jobs`);
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ ${company.company}: Failed to fetch jobs`);
    }
  }
  
  console.log(`Total jobs fetched: ${allJobs.length}`);
  return allJobs;
}