'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { type VoteInput } from '@/lib/validations';
import { calculateAverage } from '@/lib/utils';

interface VotingDialogProps {
  targetType: 'ROOM' | 'OUTFIT';
  targetId: string;
  targetName: string;
  targetImage: string;
  currentVote?: {
    aestheticness: number;
    cleanliness: number;
    creativity: number;
  };
  onVote: (data: VoteInput) => Promise<void>;
  children: React.ReactNode;
}

export function VotingDialog({
  targetType,
  targetId,
  targetName,
  targetImage,
  currentVote,
  onVote,
  children,
}: VotingDialogProps) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState({
    aestheticness: currentVote?.aestheticness || 5,
    cleanliness: currentVote?.cleanliness || 5,
    creativity: currentVote?.creativity || 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    setIsSubmitting(true);
    try {
      const voteData: VoteInput = {
        targetType,
        ...(targetType === 'ROOM'
          ? { roomId: targetId }
          : { outfitId: targetId }),
        ...scores,
      };

      await onVote(voteData);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overallScore = calculateAverage([
    scores.aestheticness,
    scores.cleanliness,
    scores.creativity,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vote on {targetName}</DialogTitle>
          <DialogDescription>
            Rate this {targetType.toLowerCase()} on three criteria (1-10 scale)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={targetImage}
                  alt={targetName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{targetName}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {targetType.toLowerCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voting Sliders */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aestheticness: {scores.aestheticness}/10
              </label>
              <Slider
                value={[scores.aestheticness]}
                onValueChange={([value]) =>
                  setScores((prev) => ({ ...prev, aestheticness: value }))
                }
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cleanliness: {scores.cleanliness}/10
              </label>
              <Slider
                value={[scores.cleanliness]}
                onValueChange={([value]) =>
                  setScores((prev) => ({ ...prev, cleanliness: value }))
                }
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creativity: {scores.creativity}/10
              </label>
              <Slider
                value={[scores.creativity]}
                onValueChange={([value]) =>
                  setScores((prev) => ({ ...prev, creativity: value }))
                }
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Overall Score Preview */}
          <Card className="bg-violet-50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-2xl font-bold text-violet-600">
                  {overallScore}/10
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVote} disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting...'
                : currentVote
                  ? 'Update Vote'
                  : 'Submit Vote'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
