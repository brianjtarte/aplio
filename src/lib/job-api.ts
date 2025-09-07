// interface JobSearchParams {
//   query?: string;
//   location?: string;
//   remote?: boolean;
//   experienceLevel?: string;
//   page?: number;
// }

// export async function fetchJobsFromJSearch(params: JobSearchParams) {
//   const url = new URL('https://jsearch.p.rapidapi.com/search');
  
//   // Build search query
//   let searchQuery = params.query || 'software engineer';
//   if (params.location && !params.remote) {
//     searchQuery += ` in ${params.location}`;
//   }
//   if (params.remote) {
//     searchQuery += ' remote';
//   }
  
//   url.searchParams.append('query', searchQuery);
//   url.searchParams.append('page', (params.page || 1).toString());
//   url.searchParams.append('num_pages', '1');
//   url.searchParams.append('date_posted', 'week');
  
//   try {
//     const response = await fetch(url.toString(), {
//       headers: {
//         'X-RapidAPI-Key': process.env.JSEARCH_API_KEY!,
//         'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error(`JSearch API error: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return normalizeJSearchResults(data.data || []);
//   } catch (error) {
//     console.error('JSearch API error:', error);
//     return [];
//   }
// }

// function normalizeJSearchResults(jobs: any[]) {
//   return jobs.map((job: any) => ({
//     source: 'JSearch',
//     sourceJobId: `jsearch-${job.job_id}`,
//     title: job.job_title,
//     company: job.employer_name,
//     location: job.job_city && job.job_state 
//       ? `${job.job_city}, ${job.job_state}`
//       : job.job_country || 'Remote',
//     mode: job.job_is_remote ? 'REMOTE' : 'ON_SITE',
//     level: mapExperienceLevel(job.job_required_experience?.required_experience_in_months),
//     category: mapJobCategory(job.job_title),
//     salary: job.job_salary || 'Not specified',
//     salaryMin: job.job_min_salary,
//     salaryMax: job.job_max_salary,
//     postedAt: new Date(job.job_posted_at_datetime_utc || Date.now()),
//     url: job.job_apply_link,
//     description: job.job_description || '',
//     requirements: job.job_required_skills?.join(', ') || '',
//     skills: job.job_required_skills?.join(',') || '',
//     active: true,
//   }));
// }

// function mapExperienceLevel(months?: number): string {
//   if (!months) return 'MID';
//   if (months <= 24) return 'ENTRY';
//   if (months <= 60) return 'MID';
//   return 'SENIOR';
// }

// function mapJobCategory(title: string): string {
//   const titleLower = title.toLowerCase();
//   if (titleLower.includes('engineer') || titleLower.includes('developer')) return 'Engineering';
//   if (titleLower.includes('design') || titleLower.includes('ux') || titleLower.includes('ui')) return 'Design';
//   if (titleLower.includes('product') || titleLower.includes('pm')) return 'Product';
//   if (titleLower.includes('marketing')) return 'Marketing';
//   if (titleLower.includes('sales')) return 'Sales';
//   return 'Other';
// }
interface JobSearchParams {
  query?: string;
  location?: string;
  remote?: boolean;
  experienceLevel?: string;
  page?: number;
}

export async function fetchJobsFromJSearch(params: JobSearchParams) {
  console.log('=== JSearch API Debug ===');
  console.log('API Key exists:', !!process.env.JSEARCH_API_KEY);
  console.log('API Key length:', process.env.JSEARCH_API_KEY?.length);
  console.log('Search params:', params);

  const url = new URL('https://jsearch.p.rapidapi.com/search');
  
  // Build search query
  let searchQuery = params.query || 'software engineer';
  if (params.location && !params.remote) {
    searchQuery += ` in ${params.location}`;
  }
  if (params.remote) {
    searchQuery += ' remote';
  }
  
  console.log('Final search query:', searchQuery);
  
  url.searchParams.append('query', searchQuery);
  url.searchParams.append('page', (params.page || 1).toString());
  url.searchParams.append('num_pages', '1');
  url.searchParams.append('date_posted', 'week');
  
  console.log('Full URL:', url.toString());
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY!,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });
    
    console.log('JSearch response status:', response.status);
    console.log('JSearch response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('JSearch error response:', errorText);
      throw new Error(`JSearch API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('JSearch raw response keys:', Object.keys(data));
    console.log('JSearch data array length:', data.data?.length || 0);
    console.log('First job sample:', data.data?.[0]);
    console.log('JSearch full response:', JSON.stringify(data, null, 2));
    
    const normalizedJobs = normalizeJSearchResults(data.data || []);
    console.log('Normalized jobs count:', normalizedJobs.length);
    console.log('First normalized job:', normalizedJobs[0]);
    
    return normalizedJobs;
  } catch (error) {
    console.error('JSearch API error:', error);
    return [];
  }
}

function normalizeJSearchResults(jobs: any[]) {
  console.log('=== Normalizing Jobs ===');
  console.log('Input jobs array length:', jobs.length);
  
  const normalized = jobs.map((job: any, index: number) => {
    console.log(`Job ${index}:`, {
      job_id: job.job_id,
      job_title: job.job_title,
      employer_name: job.employer_name,
      job_city: job.job_city,
      job_state: job.job_state,
      job_is_remote: job.job_is_remote
    });
    
    return {
      source: 'JSearch',
      sourceJobId: `jsearch-${job.job_id}`,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city && job.job_state 
        ? `${job.job_city}, ${job.job_state}`
        : job.job_country || 'Remote',
      mode: job.job_is_remote ? 'REMOTE' : 'ON_SITE',
      level: mapExperienceLevel(job.job_required_experience?.required_experience_in_months),
      category: mapJobCategory(job.job_title),
      salary: job.job_salary || 'Not specified',
      salaryMin: job.job_min_salary,
      salaryMax: job.job_max_salary,
      postedAt: new Date(job.job_posted_at_datetime_utc || Date.now()),
      url: job.job_apply_link,
      description: job.job_description || '',
      requirements: job.job_required_skills?.join(', ') || '',
      skills: job.job_required_skills?.join(',') || '',
      active: true,
    };
  });
  
  console.log('Normalized jobs:', normalized);
  return normalized;
}

function mapExperienceLevel(months?: number): string {
  if (!months) return 'MID';
  if (months <= 24) return 'ENTRY';
  if (months <= 60) return 'MID';
  return 'SENIOR';
}

function mapJobCategory(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('engineer') || titleLower.includes('developer')) return 'Engineering';
  if (titleLower.includes('design') || titleLower.includes('ux') || titleLower.includes('ui')) return 'Design';
  if (titleLower.includes('product') || titleLower.includes('pm')) return 'Product';
  if (titleLower.includes('marketing')) return 'Marketing';
  if (titleLower.includes('sales')) return 'Sales';
  return 'Other';
}