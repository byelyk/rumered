'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/mock-auth';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { type OutfitInput } from '@/lib/validations';
import { sanitizeText } from '@/lib/utils';

interface Outfit {
  id: string;
  title: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
  votes: {
    aestheticness: number;
    cleanliness: number;
    creativity: number;
  }[];
}

export default function AdminOutfitsPage() {
  const user = useUser();
  const router = useRouter();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [formData, setFormData] = useState<OutfitInput>({
    title: '',
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

    fetchOutfits();
  }, [user, router]);

  const fetchOutfits = async () => {
    try {
      const response = await fetch('/api/admin/outfits');
      const data = await response.json();
      setOutfits(data.outfits || []);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sanitize form data
      const sanitizedData = {
        ...formData,
        title: sanitizeText(formData.title),
      };

      const url = editingOutfit
        ? `/api/admin/outfits/${editingOutfit.id}`
        : '/api/admin/outfits';
      const method = editingOutfit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error('Failed to save outfit');
      }

      setIsDialogOpen(false);
      setEditingOutfit(null);
      setFormData({
        title: '',
        imageUrl: '',
        isPublished: true,
      });
      await fetchOutfits();
    } catch (error) {
      console.error('Error saving outfit:', error);
      alert('Failed to save outfit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setFormData({
      title: outfit.title,
      imageUrl: outfit.imageUrl,
      isPublished: outfit.isPublished,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (outfitId: string) => {
    if (!confirm('Are you sure you want to delete this outfit?')) return;

    try {
      const response = await fetch(`/api/admin/outfits/${outfitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete outfit');
      }

      await fetchOutfits();
    } catch (error) {
      console.error('Error deleting outfit:', error);
      alert('Failed to delete outfit. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
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
            <p className="mt-4 text-gray-600">Loading outfits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Outfits
            </h1>
            <p className="text-gray-600">
              Add, edit, and manage outfit features
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingOutfit(null);
                  setFormData({
                    title: '',
                    imageUrl: '',
                    isPublished: true,
                  });
                }}
              >
                Add New Outfit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingOutfit ? 'Edit Outfit' : 'Add New Outfit'}
                </DialogTitle>
                <DialogDescription>
                  {editingOutfit
                    ? 'Update the outfit details below.'
                    : 'Fill out the form below to add a new outfit.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
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
                    value={formData.imageUrl}
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
                    checked={formData.isPublished}
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
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Saving...'
                      : editingOutfit
                        ? 'Update Outfit'
                        : 'Add Outfit'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {outfits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No outfits found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Add your first outfit to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((outfit) => (
              <Card key={outfit.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={outfit.imageUrl}
                    alt={outfit.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        outfit.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {outfit.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{outfit.title}</CardTitle>
                  <CardDescription>
                    {outfit.votes.length} vote
                    {outfit.votes.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(outfit)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(outfit.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
