'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/lib/mock-auth';
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
import Link from 'next/link';

interface Room {
  id: string;
  displayName: string;
  hallName?: string;
  roomNumber?: string;
  campus?: string;
  school?: string;
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

export default function RoomsPage() {
  const user = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      const roomsWithVotes = await Promise.all(
        (data.rooms || []).map(async (room: Room) => {
          const userVote = await fetchUserVote(room.id);
          return { ...room, userVote };
        })
      );
      setRooms(roomsWithVotes);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms, fetchUserVote]);

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

      // Refresh rooms to get updated scores
      await fetchRooms();
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error;
    }
  };

  const fetchUserVote = async (roomId: string) => {
    if (!user) return undefined;

    try {
      const response = await fetch(
        `/api/votes?targetType=ROOM&targetId=${roomId}`
      );
      const data = await response.json();
      return data.vote;
    } catch (error) {
      console.error('Error fetching user vote:', error);
      return undefined;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dorm Room Tours
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore incredible dorm room setups and get decorating ideas. Vote
            on room aesthetics and creativity.
          </p>
          {user && (
            <Link href="/rooms/apply">
              <Button size="lg">Apply to Feature Your Room</Button>
            </Link>
          )}
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms available yet.</p>
            <p className="text-gray-400 text-sm mt-2">
              {user
                ? 'Be the first to apply to feature your room!'
                : 'Check back later for new submissions!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => {
              const avgAestheticness = calculateAverage(
                room.votes.map((v) => v.aestheticness)
              );
              const avgCleanliness = calculateAverage(
                room.votes.map((v) => v.cleanliness)
              );
              const avgCreativity = calculateAverage(
                room.votes.map((v) => v.creativity)
              );
              const overallScore = calculateAverage([
                avgAestheticness,
                avgCleanliness,
                avgCreativity,
              ]);

              return (
                <Card key={room.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={room.imageUrl}
                      alt={room.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {room.displayName}
                    </CardTitle>
                    <CardDescription>
                      {room.hallName &&
                        room.roomNumber &&
                        `${room.hallName} • Room ${room.roomNumber}`}
                      {room.school && ` • ${room.school}`}
                    </CardDescription>
                    <CardDescription>
                      {room.votes.length} vote
                      {room.votes.length !== 1 ? 's' : ''}
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

                    {user ? (
                      <VotingDialog
                        targetType="ROOM"
                        targetId={room.id}
                        targetName={room.displayName}
                        targetImage={room.imageUrl}
                        currentVote={room.userVote}
                        onVote={handleVote}
                      >
                        <Button className="w-full">
                          {room.userVote ? 'Update Vote' : 'Vote'}
                        </Button>
                      </VotingDialog>
                    ) : (
                      <Button className="w-full" disabled>
                        Login to Vote
                      </Button>
                    )}
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
