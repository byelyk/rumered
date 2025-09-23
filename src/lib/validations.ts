import { z } from 'zod';

export const voteSchema = z.object({
  targetType: z.enum(['ROOM', 'OUTFIT']),
  roomId: z.string().optional(),
  outfitId: z.string().optional(),
  aestheticness: z.number().min(1).max(10),
  cleanliness: z.number().min(1).max(10),
  creativity: z.number().min(1).max(10),
});

export const roomApplicationSchema = z.object({
  fullName: z.string().min(1).max(100),
  instagram: z.string().min(1).max(100),
  hallName: z.string().min(1).max(100),
  participantCount: z.string().min(1).max(10),
  dormType: z.string().min(1).max(20),
});

export const outfitSchema = z.object({
  title: z.string().min(1).max(100),
  imageUrl: z.string().url(),
  isPublished: z.boolean().default(true),
});

export const roomSchema = z.object({
  displayName: z.string().min(1).max(200),
  hallName: z.string().optional(),
  roomNumber: z.string().optional(),
  campus: z.string().optional(),
  school: z.string().optional(),
  imageUrl: z.string().url(),
  isPublished: z.boolean().default(true),
});

export type VoteInput = z.infer<typeof voteSchema>;
export type RoomApplicationInput = z.infer<typeof roomApplicationSchema>;
export type OutfitInput = z.infer<typeof outfitSchema>;
export type RoomInput = z.infer<typeof roomSchema>;
