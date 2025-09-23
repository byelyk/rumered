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
import { Badge } from '@/components/ui/badge';

interface Application {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  hallName: string;
  roomNumber?: string;
  campus?: string;
  school?: string;
  academicYear?: string;
  description?: string;
  photoUrls?: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem('admin-authenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
      fetchApplications();
    } else {
      router.push('/admin');
    }
  }, [router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Refresh the applications list
      await fetchApplications();
      setSelectedApplication(null); // Close modal after update
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this application? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      // Refresh the applications list
      await fetchApplications();
      setSelectedApplication(null); // Close modal after delete
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirecting to admin login...</p>
          </div>
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
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Room Applications
          </h1>
          <p className="text-gray-600">
            Manage room tour applications submitted by students.
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No applications found.</p>
              <p className="text-sm text-gray-400 mt-2">
                Applications are saved as files in the /applications folder.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <Card
                key={application.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {application.fullName || 'Anonymous'}
                      </CardTitle>
                      <CardDescription>
                        {application.hallName} - Room{' '}
                        {application.roomNumber || 'N/A'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status || 'PENDING'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Email:</strong>{' '}
                      {application.email || 'Not provided'}
                    </p>
                    <p>
                      <strong>School:</strong>{' '}
                      {application.school || 'Not specified'}
                    </p>
                    <p>
                      <strong>Year:</strong>{' '}
                      {application.academicYear || 'Not specified'}
                    </p>
                    <p>
                      <strong>Submitted:</strong>{' '}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {application.description && (
                    <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                      {application.description}
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApplication(application)}
                    >
                      View Details
                    </Button>
                    {application.status !== 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() =>
                          handleStatusUpdate(application.id, 'APPROVED')
                        }
                      >
                        Approve
                      </Button>
                    )}
                    {application.status !== 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          handleStatusUpdate(application.id, 'REJECTED')
                        }
                      >
                        Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-600 hover:text-gray-700"
                      onClick={() => handleDelete(application.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {selectedApplication.fullName || 'Anonymous'}
                    </CardTitle>
                    <CardDescription>
                      {selectedApplication.hallName} - Room{' '}
                      {selectedApplication.roomNumber || 'N/A'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Email:</strong>{' '}
                    {selectedApplication.email || 'Not provided'}
                  </div>
                  <div>
                    <strong>Phone:</strong>{' '}
                    {selectedApplication.phoneNumber || 'Not provided'}
                  </div>
                  <div>
                    <strong>School:</strong>{' '}
                    {selectedApplication.school || 'Not specified'}
                  </div>
                  <div>
                    <strong>Year:</strong>{' '}
                    {selectedApplication.academicYear || 'Not specified'}
                  </div>
                  <div>
                    <strong>Campus:</strong>{' '}
                    {selectedApplication.campus || 'Not specified'}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <Badge
                      className={`ml-2 ${getStatusColor(selectedApplication.status)}`}
                    >
                      {selectedApplication.status || 'PENDING'}
                    </Badge>
                  </div>
                </div>

                {selectedApplication.description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="mt-1 text-gray-700">
                      {selectedApplication.description}
                    </p>
                  </div>
                )}

                {selectedApplication.photoUrls &&
                  selectedApplication.photoUrls.length > 0 && (
                    <div>
                      <strong>Photos:</strong>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {selectedApplication.photoUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Room photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex gap-2 pt-4">
                  {selectedApplication.status !== 'APPROVED' && (
                    <Button
                      className="text-green-600 hover:text-green-700"
                      onClick={() =>
                        handleStatusUpdate(selectedApplication.id, 'APPROVED')
                      }
                    >
                      Approve Application
                    </Button>
                  )}
                  {selectedApplication.status !== 'REJECTED' && (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() =>
                        handleStatusUpdate(selectedApplication.id, 'REJECTED')
                      }
                    >
                      Reject Application
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="text-gray-600 hover:text-gray-700"
                    onClick={() => handleDelete(selectedApplication.id)}
                  >
                    Delete Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
