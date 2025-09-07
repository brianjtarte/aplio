'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) router.push('/signin'); // Not signed in
  }, [session, status, router]);

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

  if (!session) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                Aplio
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {session.user?.name || session.user?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your Aplio dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-gray-500 text-sm">Applications sent this month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interviews</h3>
            <div className="text-3xl font-bold text-green-600">0</div>
            <p className="text-gray-500 text-sm">Interview invitations received</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
            <div className="text-3xl font-bold text-purple-600">0%</div>
            <p className="text-gray-500 text-sm">Response rate this month</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Complete Your Profile</h3>
                <p className="text-gray-600 text-sm">Add your work experience and job preferences</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Browse Jobs</h3>
                <p className="text-gray-600 text-sm">Find and queue jobs that match your criteria</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Enable Autopilot</h3>
                <p className="text-gray-600 text-sm">Let AI automatically apply to jobs for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}