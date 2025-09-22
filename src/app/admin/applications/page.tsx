'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type RoomInput } from '@/lib/validations';
import { sanitizeText } from '@/lib/utils';

interface RoomApplication {
  id: string;
  fullName: string;
  instagram?: string;
  phoneNumber?: string;
  hallName: string;
  roomNumber?: string;
  school?: string;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
  };
}

export default function AdminApplicationsPage() {
  const user = useUser();
  const router = useRouter();
  const [applications, setApplications] = useState<RoomApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<RoomApplication | null>(null);
  const [roomFormData, setRoomFormData] = useState<RoomInput>({
    displayName: '',
    hallName: '',
    roomNumber: '',
    campus: '',
    school: '',
    imageUrl: '',
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchApplications();
  }, [user, router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    applicationId: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      await fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleCreateRoom = (application: RoomApplication) => {
    setSelectedApplication(application);
    setRoomFormData({
      displayName: `${application.hallName} • Room ${application.roomNumber || 'TBD'} (${application.fullName})`,
      hallName: application.hallName,
      roomNumber: application.roomNumber || '',
      campus: '',
      school: application.school || '',
      imageUrl: '',
      isPublished: true,
    });
    setIsCreateRoomDialogOpen(true);
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;

    setIsSubmitting(true);

    try {
      // Sanitize form data
      const sanitizedData = {
        ...roomFormData,
        displayName: sanitizeText(roomFormData.displayName),
        hallName: sanitizeText(roomFormData.hallName),
        roomNumber: roomFormData.roomNumber
          ? sanitizeText(roomFormData.roomNumber)
          : undefined,
        campus: roomFormData.campus
          ? sanitizeText(roomFormData.campus)
          : undefined,
        school: roomFormData.school
          ? sanitizeText(roomFormData.school)
          : undefined,
      };

      const response = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      // Update application status to approved
      await handleStatusUpdate(selectedApplication.id, 'APPROVED');

      setIsCreateRoomDialogOpen(false);
      setSelectedApplication(null);
      setRoomFormData({
        displayName: '',
        hallName: '',
        roomNumber: '',
        campus: '',
        school: '',
        imageUrl: '',
        isPublished: true,
      });
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRoomFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (!user || user.role !== 'ADMIN') {
    return null;
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

  const pendingApplications = applications.filter(
    (app) => app.status === 'PENDING'
  );
  const approvedApplications = applications.filter(
    (app) => app.status === 'APPROVED'
  );
  const rejectedApplications = applications.filter(
    (app) => app.status === 'REJECTED'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Applications
          </h1>
          <p className="text-gray-600">
            Review and manage room feature applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingApplications.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {approvedApplications.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {rejectedApplications.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No applications found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {application.fullName}
                      </CardTitle>
                      <CardDescription>
                        {application.hallName}
                        {application.roomNumber &&
                          ` • Room ${application.roomNumber}`}
                        {application.school && ` • ${application.school}`}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Email:</strong> {application.user.email}
                    </p>
                    {application.instagram && (
                      <p>
                        <strong>Instagram:</strong> {application.instagram}
                      </p>
                    )}
                    {application.phoneNumber && (
                      <p>
                        <strong>Phone:</strong> {application.phoneNumber}
                      </p>
                    )}
                    {application.message && (
                      <p>
                        <strong>Message:</strong> {application.message}
                      </p>
                    )}
                    <p>
                      <strong>Applied:</strong>{' '}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {application.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(application.id, 'APPROVED')
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateRoom(application)}
                      >
                        Create Room
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleStatusUpdate(application.id, 'REJECTED')
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Room Dialog */}
        <Dialog
          open={isCreateRoomDialogOpen}
          onOpenChange={setIsCreateRoomDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Room from Application</DialogTitle>
              <DialogDescription>
                Create a room feature from the approved application. You can
                modify the details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name *
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={roomFormData.displayName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="hallName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hall Name
                  </label>
                  <input
                    type="text"
                    id="hallName"
                    name="hallName"
                    value={roomFormData.hallName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="roomNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room Number
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    name="roomNumber"
                    value={roomFormData.roomNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="campus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Campus
                  </label>
                  <input
                    type="text"
                    id="campus"
                    name="campus"
                    value={roomFormData.campus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="school"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    School
                  </label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={roomFormData.school}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image URL *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={roomFormData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={roomFormData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPublished"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Published
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateRoomDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Room & Approve'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
