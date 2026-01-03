'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6">
            Francisco Alfaro
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-8">
            Full Stack Developer & Digital Designer
          </p>

          <p className="text-base sm:text-lg text-gray-400 mb-12 leading-relaxed">
            Crafting innovative digital experiences with modern web technologies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/misc">
              <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors">
                View My Work
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded transition-colors">
                Get in Touch
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/misc">
            <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer h-full">
              <h3 className="text-2xl font-bold text-white mb-2">
                Misc Projects
              </h3>
              <p className="text-gray-300">
                Explore my diverse collection of innovative projects
              </p>
            </div>
          </Link>

          <Link href="/web3">
            <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer h-full">
              <h3 className="text-2xl font-bold text-white mb-2">
                Web3 Projects
              </h3>
              <p className="text-gray-300">
                Next-generation blockchain applications
              </p>
            </div>
          </Link>

          <Link href="/about">
            <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer h-full sm:col-span-2 lg:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                About Me
              </h3>
              <p className="text-gray-300">
                Skills, experience, and background
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
