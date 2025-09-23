'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-violet-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-violet-600">
              Rumered
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href="/fit-check"
              className="text-gray-700 hover:text-violet-600 transition-colors"
            >
              Fit Check
            </Link>
            <Link
              href="/rooms"
              className="text-gray-700 hover:text-violet-600 transition-colors"
            >
              Dorm Rooms
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 hover:text-violet-600 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
