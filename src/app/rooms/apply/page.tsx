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
        "🎉 Application submitted successfully! We'll review it and get back to you soon."
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPhotoUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrls: [...(prev.photoUrls || []), ''],
    }));
  };

  const removePhotoUrlField = (index: number) => {
    setFormData((prev) => {
      const newPhotoUrls = [...(prev.photoUrls || [])];
      newPhotoUrls.splice(index, 1);
      return { ...prev, photoUrls: newPhotoUrls };
    });
  };

  const updatePhotoUrl = (index: number, value: string) => {
    setFormData((prev) => {
      const newPhotoUrls = [...(prev.photoUrls || [])];
      newPhotoUrls[index] = value;
      return { ...prev, photoUrls: newPhotoUrls };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Apply for a Dorm Room Tour
          </h1>
          <p className="text-xl text-violet-100 mb-8">
            Showcase your amazing dorm room setup and inspire other students!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-300 rounded-full"></span>
              <span>Free to apply</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-300 rounded-full"></span>
              <span>Quick review process</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-300 rounded-full"></span>
              <span>Get featured on Rumered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Room Application Form
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Tell us about your dorm room and why it deserves to be featured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-violet-600 border-b border-violet-200 pb-2">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="your.email@university.edu"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="(555) 123-4567"
                      />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="@yourusername"
                      />
                    </div>
                  </div>
                </div>

                {/* Room Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-violet-600 border-b border-violet-200 pb-2">
                    Room Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="e.g., Smith Hall, Tower A"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="e.g., 205, 3B"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="e.g., University of Houston"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      >
                        <option value="">Select Year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Room Description */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-violet-600 border-b border-violet-200 pb-2">
                    Tell Us About Your Room
                  </h3>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Room Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                      placeholder="Describe your room setup, what makes it special, your decorating style, favorite features, etc. This helps us understand why your room should be featured!"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-violet-600 border-b border-violet-200 pb-2">
                    Room Photos
                  </h3>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Add photos of your room to showcase your setup. You can
                      add multiple photos by clicking &quot;Add Photo URL&quot;.
                    </p>

                    {formData.photoUrls?.map((url, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) =>
                            updatePhotoUrl(index, e.target.value)
                          }
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                          placeholder="https://example.com/your-room-photo.jpg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePhotoUrlField(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPhotoUrlField}
                      className="border-violet-300 text-violet-600 hover:bg-violet-50"
                    >
                      + Add Photo URL
                    </Button>
                  </div>
                </div>

                {/* Additional Message */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-violet-600 border-b border-violet-200 pb-2">
                    Additional Information
                  </h3>

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
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                      placeholder="Any additional notes, special features, or anything else you'd like us to know about your room..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
