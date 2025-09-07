'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  createdAt: string;
  autopilot: boolean;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    mode: string;
    salary: string;
    url: string;
  };
}

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/signin');
      return;
    }
    
    loadApplications();
  }, [session, status, router]);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        console.log('Applications data:', data); // Debug log
        setApplications(data.applications || []);
      } else {
        console.error('Failed to load applications:', response.status);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <div className="text-xl">Loading applications...</div>
        </div>
      </div>
    );
  }

  if (!session) return null;

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
            <nav className="flex space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
              <a href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</a>
              <a href="/applications" className="text-blue-600 font-medium">Applications</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track your job application history and status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'APPLIED').length}
            </div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">
              {applications.filter(app => app.status === 'INTERVIEW').length}
            </div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(app => app.autopilot).length}
            </div>
            <div className="text-sm text-gray-600">Autopilot</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No applications yet</div>
              <p className="text-gray-400 mb-4">Start applying to jobs to see them here</p>
              <a href="/jobs" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Browse Jobs
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {application.job.title}
                      </h3>
                      <p className="text-gray-700 mb-1">{application.job.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{application.job.location}</span>
                        <span>•</span>
                        <span>{application.job.mode}</span>
                        <span>•</span>
                        <span>Applied {formatDate(application.appliedAt || application.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{application.job.salary}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {application.status.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}