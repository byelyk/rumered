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
  email: z.string().email().optional(),
  instagram: z.string().optional(),
  phoneNumber: z.string().optional(),
  hallName: z.string().min(1).max(100),
  roomNumber: z.string().optional(),
  school: z.string().optional(),
  academicYear: z.string().optional(),
  description: z.string().optional(),
  photoUrls: z.array(z.string().url()).optional(),
  message: z.string().optional(),
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
