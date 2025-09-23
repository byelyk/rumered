'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Stats {
  totalRooms: number;
  totalOutfits: number;
  totalApplications: number;
  pendingApplications: number;
  totalVotes: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAccessForm, setShowAccessForm] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem('admin-authenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
      setShowAccessForm(false);
      fetchStats();
    }
  }, []);

  const handleAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === 'RUMERED2024') {
      setIsAuthenticated(true);
      setShowAccessForm(false);
      localStorage.setItem('admin-authenticated', 'true');
      fetchStats();
    } else {
      alert('Invalid access code. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAccessForm(true);
    localStorage.removeItem('admin-authenticated');
    setAccessCode('');
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showAccessForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Admin Access</CardTitle>
              <CardDescription className="text-center">
                Enter the access code to view the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccessCode} className="space-y-4">
                <div>
                  <label
                    htmlFor="accessCode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Access Code
                  </label>
                  <input
                    type="password"
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter access code"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage rooms, outfits, and applications
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Rooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-600">
                  {stats.totalRooms}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Outfits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-600">
                  {stats.totalOutfits}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-600">
                  {stats.totalApplications}
                </div>
                <p className="text-xs text-gray-500">
                  {stats.pendingApplications} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Votes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-600">
                  {stats.totalVotes}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pending Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pendingApplications}
                </div>
                <p className="text-xs text-gray-500">Need attention</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Review Applications</CardTitle>
              <CardDescription>
                Review and manage room applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/applications">
                <Button className="w-full">Review Applications</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
