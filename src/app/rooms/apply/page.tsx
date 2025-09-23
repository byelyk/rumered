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
    instagram: '',
    hallName: '',
    participantCount: '',
    dormType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sanitize form data
      const sanitizedData = {
        fullName: sanitizeText(formData.fullName),
        instagram: formData.instagram
          ? sanitizeText(formData.instagram)
          : undefined,
        hallName: sanitizeText(formData.hallName),
        participantCount: formData.participantCount
          ? sanitizeText(formData.participantCount)
          : undefined,
        dormType: formData.dormType
          ? sanitizeText(formData.dormType)
          : undefined,
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
        instagram: '',
        hallName: '',
        participantCount: '',
        dormType: '',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
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
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Simple Room Application
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Just 3 quick questions to get started!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
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
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Instagram Handle *
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hallName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Dorm Hall Name *
                    </label>
                    <input
                      type="text"
                      id="hallName"
                      name="hallName"
                      value={formData.hallName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="e.g., Cougar Village II, Moody Towers, etc."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="participantCount"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      How many people will be participating in the tour? *
                    </label>
                    <select
                      id="participantCount"
                      name="participantCount"
                      value={formData.participantCount || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    >
                      <option value="">Select number of participants</option>
                      <option value="1">1 person</option>
                      <option value="2">2 people</option>
                      <option value="3">3 people</option>
                      <option value="4">4 people</option>
                      <option value="5+">5+ people</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="dormType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Is this a girl or boy dorm? *
                    </label>
                    <select
                      id="dormType"
                      name="dormType"
                      value={formData.dormType || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    >
                      <option value="">Select dorm type</option>
                      <option value="Girls">Girls dorm</option>
                      <option value="Boys">Boys dorm</option>
                      <option value="Co-ed">Co-ed dorm</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-6 py-3"
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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
