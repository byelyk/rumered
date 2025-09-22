'use client';

import { useUser } from '@/lib/mock-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (user) {
    return null;
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
            <a
              href="/login"
              className="font-medium text-violet-600 hover:text-violet-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Rumered</CardTitle>
            <CardDescription>
              Create an account to start voting on outfits and rooms, and submit
              your own content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => user?.signUp()} className="w-full">
              Sign up with StackAuth
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
