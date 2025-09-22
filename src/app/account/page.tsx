'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RoomApplication {
  id: string;
  fullName: string;
  hallName: string;
  roomNumber?: string;
  school?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface Vote {
  id: string;
  targetType: 'ROOM' | 'OUTFIT';
  aestheticness: number;
  cleanliness: number;
  creativity: number;
  createdAt: string;
  room?: {
    id: string;
    displayName: string;
  };
  outfit?: {
    id: string;
    title: string;
  };
}

export default function AccountPage() {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<RoomApplication[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchUserData();
  }, [user, router]);

  const fetchUserData = async () => {
    try {
      const [applicationsRes, votesRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/user-votes'),
      ]);

      const applicationsData = await applicationsRes.json();
      const votesData = await votesRes.json();

      setApplications(applicationsData.applications || []);
      setVotes(votesData.votes || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading account...</p>
          </div>
        </div>
      </div>
    );
  }

  const successMessage = searchParams.get('success');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Welcome back, {user.displayName || user.email}!
          </p>
        </div>

        {successMessage === 'application-submitted' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              Your room application has been submitted successfully! We&apos;ll
              review it and get back to you soon.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Room Applications</CardTitle>
              <CardDescription>
                Track your room feature applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No applications yet</p>
                  <Link href="/rooms/apply">
                    <Button>Apply to Feature Your Room</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{app.fullName}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {app.hallName}
                        {app.roomNumber && ` • Room ${app.roomNumber}`}
                        {app.school && ` • ${app.school}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Link href="/rooms/apply">
                      <Button variant="outline" className="w-full">
                        Submit New Application
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voting History */}
          <Card>
            <CardHeader>
              <CardTitle>Voting History</CardTitle>
              <CardDescription>
                Your recent votes on outfits and rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {votes.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No votes yet</p>
                  <div className="space-y-2">
                    <Link href="/fit-check">
                      <Button variant="outline" className="w-full">
                        Vote on Outfits
                      </Button>
                    </Link>
                    <Link href="/rooms">
                      <Button variant="outline" className="w-full">
                        Vote on Rooms
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {votes.slice(0, 5).map((vote) => (
                    <div
                      key={vote.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">
                          {vote.targetType === 'ROOM'
                            ? vote.room?.displayName
                            : vote.outfit?.title}
                        </h3>
                        <span className="text-xs text-gray-500 capitalize">
                          {vote.targetType.toLowerCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Aesthetic:</span>
                          <span className="ml-1 font-medium">
                            {vote.aestheticness}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Clean:</span>
                          <span className="ml-1 font-medium">
                            {vote.cleanliness}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Creative:</span>
                          <span className="ml-1 font-medium">
                            {vote.creativity}/10
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Voted {new Date(vote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {votes.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      And {votes.length - 5} more votes...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
