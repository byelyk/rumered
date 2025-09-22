'use client';

import { useUser } from '@stackframe/stack';
import { SignUp } from '@stackframe/stack';
import Link from 'next/link';

export default function RegisterPage() {
  const user = useUser();

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You&apos;re already signed in!
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome back, {user.displayName || user.email}!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-violet-600 text-white hover:bg-violet-700 h-10 px-4 py-2"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/login"
              className="font-medium text-violet-600 hover:text-violet-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
