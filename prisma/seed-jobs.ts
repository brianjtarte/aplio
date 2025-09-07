import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleJobs = [
  {
    source: 'MockAPI',
    sourceJobId: 'job-001',
    title: 'Senior Full Stack Engineer',
    company: 'TechFlow Inc',
    location: 'San Francisco, CA',
    mode: 'HYBRID',
    level: 'SENIOR',
    category: 'Engineering',
    salary: '$150,000 - $200,000',
    salaryMin: 150000,
    salaryMax: 200000,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    url: 'https://example.com/jobs/senior-fullstack',
    description: `We're looking for a Senior Full Stack Engineer to join our growing team. You'll work on building scalable web applications using modern technologies like React, Node.js, and TypeScript.

Requirements:
- 5+ years of experience in full stack development
- Strong proficiency in React and Node.js
- Experience with TypeScript and modern JavaScript
- Knowledge of cloud platforms (AWS/GCP/Azure)
- Strong problem-solving and communication skills

What we offer:
- Competitive salary and equity
- Comprehensive health insurance
- Flexible work arrangements
- Professional development budget`,
    requirements: 'React, Node.js, TypeScript, 5+ years experience',
    skills: 'React,Node.js,TypeScript,AWS,JavaScript',
  },
  {
    source: 'MockAPI',
    sourceJobId: 'job-002',
    title: 'Frontend Developer',
    company: 'DesignCorp',
    location: 'Remote',
    mode: 'REMOTE',
    level: 'MID',
    category: 'Engineering',
    salary: '$100,000 - $140,000',
    salaryMin: 100000,
    salaryMax: 140000,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    url: 'https://example.com/jobs/frontend-dev',
    description: `Join our design-focused team as a Frontend Developer. You'll create beautiful, responsive user interfaces and work closely with our design team to bring mockups to life.

Requirements:
- 3+ years of frontend development experience
- Expert knowledge of React and modern CSS
- Experience with design systems and component libraries
- Strong eye for design and attention to detail
- Experience with testing frameworks

Benefits:
- Remote-first culture
- Design-focused environment
- Latest tools and technologies
- Growth opportunities`,
    requirements: 'React, CSS, 3+ years experience, design systems',
    skills: 'React,CSS,JavaScript,Design Systems,HTML',
  },
  {
    source: 'MockAPI',
    sourceJobId: 'job-003',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    mode: 'ON_SITE',
    level: 'SENIOR',
    category: 'Product',
    salary: '$140,000 - $180,000',
    salaryMin: 140000,
    salaryMax: 180000,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    url: 'https://example.com/jobs/product-manager',
    description: `We're seeking a Senior Product Manager to drive our product strategy and work with cross-functional teams to deliver amazing user experiences.

Responsibilities:
- Define product roadmap and strategy
- Work with engineering and design teams
- Analyze user data and market trends
- Manage product launches and iterations
- Collaborate with stakeholders across the organization

Requirements:
- 5+ years of product management experience
- Strong analytical and problem-solving skills
- Experience with agile development processes
- Excellent communication and leadership skills`,
    requirements: 'Product management, 5+ years, analytics, leadership',
    skills: 'Product Management,Analytics,Agile,Leadership,Strategy',
  },
];

async function seedJobs() {
  console.log('Seeding jobs...');
  
  for (const job of sampleJobs) {
    await prisma.job.upsert({
      where: { sourceJobId: job.sourceJobId },
      update: job,
      create: job,
    });
  }
  
  console.log('Jobs seeded successfully!');
}

seedJobs()
  .catch((e) => {
    console.error('Error seeding jobs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });