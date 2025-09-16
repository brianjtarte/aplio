import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl">⚡</div>
            <h1 className="text-4xl lg:text-6xl font-bold ml-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Aplio
              </span>
            </h1>
          </div>
          
          <h2 className="text-2xl lg:text-4xl font-bold mb-6 text-gray-800">
            Let AI Apply to 100+ Jobs While You Sleep
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Aplio automates your job applications with AI-generated resumes 
            and cover letters, applying to hundreds of relevant positions monthly 
            so you can focus on landing interviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
            
            <Link href="/signin"></Link>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
                Sign In
              </button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-gray-600">Applications Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function HomePage() {
//   return (
//     <div className="bg-red-500 text-white p-8">
//       <h1 className="text-4xl font-bold">Tailwind Test</h1>
//       <p className="text-lg">If this is red with white text, Tailwind is working</p>
//     </div>
//   );
// }