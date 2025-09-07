'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');

  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Passwords don't match");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch('/api/auth/signup', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         email: formData.email,
  //         password: formData.password,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || 'Failed to create account');
  //     }

  //     // Auto sign in after successful registration
  //     const result = await signIn('credentials', {
  //       email: formData.email,
  //       password: formData.password,
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       setError('Account created but failed to sign in. Please try signing in manually.');
  //     } else {
  //       router.push('/dashboard');
  //     }
  //   } catch (error: any) {
  //     setError(error.message || 'An unexpected error occurred. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords don't match");
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create account');
    }

    // Auto sign in after successful registration
    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Account created but failed to sign in. Please try signing in manually.');
    } else if (result?.ok) {
      // Force refresh to ensure session is loaded
      window.location.href = '/dashboard';
    }
  } catch (error: any) {
    setError(error.message || 'An unexpected error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl">⚡</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
              Aplio
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
          <p className="text-gray-600 mt-2">Start your AI-powered job search journey today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-500 hover:underline text-sm">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}