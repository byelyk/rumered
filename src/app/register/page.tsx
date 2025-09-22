'use client';

import { useUser } from '@/lib/mock-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-violet-600 hover:text-violet-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Rumered</CardTitle>
            <CardDescription>
              Create an account to vote on outfits and rooms, and submit your
              own content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                alert(
                  'Sign up functionality will work once StackAuth is properly configured in the dashboard'
                );
              }}
              className="w-full"
            >
              Sign up with StackAuth
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
