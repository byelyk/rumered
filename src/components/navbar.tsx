'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session, status } = useSession();

  // Use NextAuth session
  const currentUser = session?.user;

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

            {status === 'loading' ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hi,{' '}
                  {(currentUser as { displayName?: string })?.displayName ||
                    currentUser.name ||
                    currentUser.email}
                </span>
                <Link
                  href="/account"
                  className="text-gray-700 hover:text-violet-600 transition-colors"
                >
                  Account
                </Link>
                {(currentUser as { role?: string })?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-violet-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
