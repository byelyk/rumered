'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type RoomApplicationInput } from '@/lib/validations';
import { sanitizeText } from '@/lib/utils';

export default function RoomApplicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RoomApplicationInput>({
    fullName: '',
    email: '',
    instagram: '',
    phoneNumber: '',
    hallName: '',
    roomNumber: '',
    school: '',
    academicYear: '',
    description: '',
    photoUrls: [],
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sanitize form data
      const sanitizedData = {
        ...formData,
        fullName: sanitizeText(formData.fullName),
        hallName: sanitizeText(formData.hallName),
        roomNumber: formData.roomNumber
          ? sanitizeText(formData.roomNumber)
          : undefined,
        school: formData.school ? sanitizeText(formData.school) : undefined,
        academicYear: formData.academicYear
          ? sanitizeText(formData.academicYear)
          : undefined,
        description: formData.description
          ? sanitizeText(formData.description)
          : undefined,
        message: formData.message ? sanitizeText(formData.message) : undefined,
        photoUrls: formData.photoUrls?.filter((url) => url.trim() !== '') || [],
      };

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      alert(
        "Application submitted successfully! We'll review it and get back to you soon."
      );
      setFormData({
        fullName: '',
        email: '',
        instagram: '',
        phoneNumber: '',
        hallName: '',
        roomNumber: '',
        school: '',
        academicYear: '',
        description: '',
        photoUrls: [],
        message: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Apply to Feature Your Room
          </h1>
          <p className="text-gray-600">
            Submit your dorm room for a chance to be featured on Rumered.
            We&apos;ll review your application and get back to you soon!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room Application</CardTitle>
            <CardDescription>
              Fill out the form below to apply for your room to be featured.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="hallName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hall/Building Name *
                </label>
                <input
                  type="text"
                  id="hallName"
                  name="hallName"
                  value={formData.hallName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="roomNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Room Number
                </label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="school"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  School/University
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="academicYear"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Academic Year
                </label>
                <select
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                >
                  <option value="">Select Year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="instagram"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Room Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Describe your room setup, what makes it special, or any other details you'd like to share..."
                />
              </div>

              <div>
                <label
                  htmlFor="photoUrls"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Photo URLs (Optional)
                </label>
                <div className="space-y-2">
                  {formData.photoUrls?.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newPhotoUrls = [...(formData.photoUrls || [])];
                          newPhotoUrls[index] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            photoUrls: newPhotoUrls,
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                        placeholder="https://example.com/photo.jpg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newPhotoUrls = [...(formData.photoUrls || [])];
                          newPhotoUrls.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            photoUrls: newPhotoUrls,
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        photoUrls: [...(prev.photoUrls || []), ''],
                      }));
                    }}
                  >
                    Add Photo URL
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Additional Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Any additional notes or comments..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
