// 'use client';

// import { useSession } from 'next-auth/react';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function ProfilePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     headline: '',
//     location: '',
//     salaryMin: '',
//     salaryMax: '',
//     summary: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session) router.push('/signin');
//   }, [session, status, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage('');

//     try {
//       // We'll implement the API route next
//       setMessage('Profile saved successfully!');
//     } catch (error) {
//       setMessage('Failed to save profile. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-4xl mb-4">⚡</div>
//           <div className="text-xl">Loading...</div>
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
//               <a href="/profile" className="text-blue-600 font-medium">Profile</a>
//               <a href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</a>
//             </nav>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
//           <p className="text-gray-600 mt-2">Tell us about yourself to get better job matches</p>
//         </div>

//         {message && (
//           <div className={`mb-6 p-4 rounded-lg ${
//             message.includes('successfully') 
//               ? 'bg-green-50 border border-green-200 text-green-700'
//               : 'bg-red-50 border border-red-200 text-red-700'
//           }`}>
//             {message}
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow">
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div>
//               <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
//                 Professional Headline
//               </label>
//               <input
//                 id="headline"
//                 type="text"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., Senior Software Engineer"
//                 value={formData.headline}
//                 onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
//               />
//             </div>

//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
//                 Location
//               </label>
//               <input
//                 id="location"
//                 type="text"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., San Francisco, CA or Remote"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
//                   Minimum Salary
//                 </label>
//                 <input
//                   id="salaryMin"
//                   type="number"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="80000"
//                   value={formData.salaryMin}
//                   onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
//                   Maximum Salary
//                 </label>
//                 <input
//                   id="salaryMax"
//                   type="number"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="120000"
//                   value={formData.salaryMax}
//                   onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
//                 Professional Summary
//               </label>
//               <textarea
//                 id="summary"
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Brief summary of your experience and what you're looking for..."
//                 value={formData.summary}
//                 onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
//               />
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isLoading ? 'Saving...' : 'Save Profile'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    headline: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    summary: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   if (status === 'loading') return;
  //   if (!session) router.push('/signin');
    
  //   // Load existing profile data
  //   if (session) {
  //     loadProfile();
  //   }
  // }, [session, status, router]);
  useEffect(() => {
  if (status === 'loading') return;
  if (!session) {
    router.push('/signin');
    return;
  }
  
  // Load existing profile data only when we have a session
  loadProfile();
}, [session, status, router]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setFormData({
            headline: data.profile.headline || '',
            location: data.profile.location || '',
            salaryMin: data.profile.salaryMin?.toString() || '',
            salaryMax: data.profile.salaryMax?.toString() || '',
            summary: data.profile.summary || '',
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: formData.headline,
          location: formData.location,
          salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
          salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
          summary: formData.summary,
        }),
      });

      if (response.ok) {
        setMessage('Profile saved successfully!');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to save profile');
      }
    } catch (error) {
      setMessage('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                Aplio
              </span>
            </div>
            <nav className="flex space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/profile" className="text-blue-600 font-medium">Profile</a>
              <a href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Tell us about yourself to get better job matches</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
                Professional Headline
              </label>
              <input
                id="headline"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Senior Software Engineer"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary
                </label>
                <input
                  id="salaryMin"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="80000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary
                </label>
                <input
                  id="salaryMax"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="120000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                Professional Summary
              </label>
              <textarea
                id="summary"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief summary of your experience and what you're looking for..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}