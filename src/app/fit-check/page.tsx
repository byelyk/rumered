'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VotingDialog } from '@/components/voting-dialog';
import { calculateAverage } from '@/lib/utils';
import { type VoteInput } from '@/lib/validations';

interface Outfit {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  votes: {
    aestheticness: number;
    cleanliness: number;
    creativity: number;
  }[];
  userVote?: {
    aestheticness: number;
    cleanliness: number;
    creativity: number;
  };
}

export default function FitCheckPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserVote = useCallback(async (outfitId: string) => {
    try {
      const response = await fetch(
        `/api/votes?targetType=OUTFIT&targetId=${outfitId}`
      );
      const data = await response.json();
      return data.vote;
    } catch (error) {
      console.error('Error fetching user vote:', error);
      return undefined;
    }
  }, []);

  const fetchOutfits = useCallback(async () => {
    try {
      const response = await fetch('/api/outfits');
      const data = await response.json();
      const outfitsWithVotes = await Promise.all(
        (data.outfits || []).map(async (outfit: Outfit) => {
          const userVote = await fetchUserVote(outfit.id);
          return { ...outfit, userVote };
        })
      );
      setOutfits(outfitsWithVotes);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchUserVote]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  const handleVote = async (voteData: VoteInput) => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      // Refresh outfits to get updated scores
      await fetchOutfits();
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error;
    }
  };

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fit Check</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing outfits from college students around the world.
            Vote on aestheticness, cleanliness, and creativity.
          </p>
        </div>

        {outfits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No outfits available yet.</p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for new submissions!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {outfits.map((outfit) => {
              const avgAestheticness = calculateAverage(
                outfit.votes.map((v) => v.aestheticness)
              );
              const avgCleanliness = calculateAverage(
                outfit.votes.map((v) => v.cleanliness)
              );
              const avgCreativity = calculateAverage(
                outfit.votes.map((v) => v.creativity)
              );
              const overallScore = calculateAverage([
                avgAestheticness,
                avgCleanliness,
                avgCreativity,
              ]);

              return (
                <Card key={outfit.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={outfit.imageUrl}
                      alt={outfit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{outfit.title}</CardTitle>
                    <CardDescription>
                      {outfit.votes.length} vote
                      {outfit.votes.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Aestheticness:</span>
                        <span className="font-medium">
                          {avgAestheticness.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cleanliness:</span>
                        <span className="font-medium">
                          {avgCleanliness.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Creativity:</span>
                        <span className="font-medium">
                          {avgCreativity.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t pt-2">
                        <span>Overall:</span>
                        <span className="text-violet-600">
                          {overallScore.toFixed(1)}/10
                        </span>
                      </div>
                    </div>

                    <VotingDialog
                      targetType="OUTFIT"
                      targetId={outfit.id}
                      targetName={outfit.title}
                      targetImage={outfit.imageUrl}
                      currentVote={outfit.userVote}
                      onVote={handleVote}
                    >
                      <Button className="w-full">
                        {outfit.userVote ? 'Update Vote' : 'Vote'}
                      </Button>
                    </VotingDialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
