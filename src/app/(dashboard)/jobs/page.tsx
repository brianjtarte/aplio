// 'use client';

// import { useSession } from 'next-auth/react';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// interface Job {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   mode: string;
//   level: string;
//   salary: string;
//   postedAt: string;
//   description: string;
//   skills: string;
// }

// export default function JobsPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session) {
//       router.push('/signin');
//       return;
//     }
    
//     loadJobs();
//   }, [session, status, router]);

//   const loadJobs = async () => {
//     try {
//       const response = await fetch('/api/jobs');
//       if (response.ok) {
//         const data = await response.json();
//         setJobs(data.jobs || []);
//       }
//     } catch (error) {
//       console.error('Failed to load jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleJobSelect = (jobId: string) => {
//     setSelectedJobs(prev => 
//       prev.includes(jobId) 
//         ? prev.filter(id => id !== jobId)
//         : [...prev, jobId]
//     );
//   };

//   // const handleApplyToSelected = async () => {
//   //   if (selectedJobs.length === 0) return;
    
//   //   // We'll implement the application API later
//   //   alert(`Would apply to ${selectedJobs.length} jobs!`);
//   // };
//   // Replace the handleApplyToSelected function in your jobs page:

//   const handleApplyToSelected = async () => {
//     if (selectedJobs.length === 0) return;
    
//     try {
//       const response = await fetch('/api/applications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ jobIds: selectedJobs }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         alert(data.message);
//         setSelectedJobs([]); // Clear selections
//       } else {
//         const error = await response.json();
//         alert(error.message || 'Failed to apply to jobs');
//       }
//     } catch (error) {
//       alert('Failed to apply to jobs. Please try again.');
//     }
//   };

//   const handleIngestJobs = async () => {
//   try {
//     setLoading(true);
//     const response = await fetch('/api/jobs/ingest', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         query: searchTerm || 'software engineer', 
//         location: 'United States' 
//       }),
//     });
    
//     if (response.ok) {
//       const data = await response.json();
//       alert(`Ingested ${data.count} new jobs!`);
//       loadJobs(); // Refresh the job list
//     } else {
//       alert('Failed to fetch new jobs');
//     }
//   } catch (error) {
//     alert('Failed to fetch new jobs');
//   } finally {
//     setLoading(false);
//   }
// };

//   const formatPostedDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Posted 1 day ago';
//     return `Posted ${diffDays} days ago`;
//   };

//   if (status === 'loading' || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-4xl mb-4">⚡</div>
//           <div className="text-xl">Loading jobs...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!session) return null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <span className="text-2xl">⚡</span>
//               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
//                 Aplio
//               </span>
//             </div>
//             <nav className="flex space-x-4">
//               <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
//               <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
//               <a href="/jobs" className="text-blue-600 font-medium">Jobs</a>
//             </nav>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
//           <p className="text-gray-600 mt-2">Find and apply to jobs that match your profile</p>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="flex gap-4">
//             <input
//               type="text"
//               placeholder="Search jobs, companies, or keywords..."
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
//               Search
//             </button>
//             <button 
//               onClick={handleIngestJobs}
//               disabled={loading}
//               className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
//             >
//               {loading ? 'Fetching...' : 'Fetch Real Jobs'}
//             </button>
//           </div>
//         </div>

//         {/* Selected Jobs Bar */}
//         {selectedJobs.length > 0 && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <span className="text-blue-700 font-medium">
//                 {selectedJobs.length} job(s) selected
//               </span>
//               <button
//                 onClick={handleApplyToSelected}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//               >
//                 Apply to Selected
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Jobs List */}
//         <div className="space-y-4">
//           {jobs.map((job) => (
//             <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
//               <div className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start space-x-4 flex-1">
//                     <input
//                       type="checkbox"
//                       checked={selectedJobs.includes(job.id)}
//                       onChange={() => handleJobSelect(job.id)}
//                       className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
                    
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-1">
//                         {job.title}
//                       </h3>
//                       <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                      
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                           {job.location}
//                         </span>
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {job.mode}
//                         </span>
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           {job.level}
//                         </span>
//                       </div>
                      
//                       <p className="text-gray-600 mb-4 line-clamp-3">
//                         {job.description.substring(0, 200)}...
//                       </p>
                      
//                       <div className="flex items-center justify-between">
//                         <div className="flex flex-wrap gap-1">
//                           {job.skills.split(',').slice(0, 4).map((skill, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-700"
//                             >
//                               {skill.trim()}
//                             </span>
//                           ))}
//                         </div>
//                         <span className="text-sm text-gray-500">
//                           {formatPostedDate(job.postedAt)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="ml-4 text-right">
//                     <p className="text-lg font-semibold text-gray-900 mb-2">
//                       {job.salary}
//                     </p>
//                     <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {jobs.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-500 text-lg">No jobs found</div>
//             <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Clock } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  mode: string;
  level: string;
  category: string;
  postedAt: string;
  source: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastIngestionTime, setLastIngestionTime] = useState<Date | null>(null);

  // Load jobs on component mount - fast database read only
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs/recent'); // New endpoint for recent US jobs
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        if (data.lastIngestionTime) {
          setLastIngestionTime(new Date(data.lastIngestionTime));
        }
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleApplyToSelected = async () => {
    if (selectedJobs.size === 0) {
      alert('Please select at least one job to apply to.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobIds: Array.from(selectedJobs)
        }),
      });

      if (response.ok) {
        alert(`Successfully applied to ${selectedJobs.size} jobs!`);
        setSelectedJobs(new Set());
      } else {
        alert('Failed to submit applications');
      }
    } catch (error) {
      alert('Error submitting applications');
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique companies count
  const uniqueCompanies = new Set(jobs.map(j => j.company)).size;

  // Calculate how fresh the data is
  const getDataFreshness = () => {
    if (!lastIngestionTime) return 'Unknown';
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastIngestionTime.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
            <p className="text-gray-600 mt-2">Latest US-based positions from top tech companies</p>
          </div>
          {lastIngestionTime && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>Updated {getDataFreshness()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Job Stats */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredJobs.length}</div>
            <div className="text-gray-600">Available Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{selectedJobs.size}</div>
            <div className="text-gray-600">Selected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{uniqueCompanies}</div>
            <div className="text-gray-600">Companies</div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      {selectedJobs.size > 0 && (
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              {selectedJobs.size} job{selectedJobs.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleApplyToSelected}
              disabled={loading}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Apply to Selected Jobs
            </button>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {jobs.length === 0 
                ? 'No recent jobs found. New jobs are automatically synced from company boards every 12 hours.'
                : 'No jobs match your search. Try different keywords.'
              }
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-lg shadow p-6 border-2 transition-all cursor-pointer ${
                selectedJobs.has(job.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => handleJobSelect(job.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-lg text-gray-700 mb-1">{job.company}</p>
                  <p className="text-gray-600 mb-3">{job.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {job.salary}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {job.mode}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {job.level}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {job.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={selectedJobs.has(job.id)}
                    onChange={() => handleJobSelect(job.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}