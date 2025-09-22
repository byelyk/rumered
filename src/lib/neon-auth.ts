// Neon Auth configuration
// This will be used instead of StackAuth

import { neon } from '@neondatabase/serverless';

// Initialize Neon client
export const neonClient = neon(process.env.DATABASE_URL!);

// Simple auth utilities for Neon Auth
export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// Mock user for development
const mockUser: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  displayName: 'Test User',
  role: 'USER',
  createdAt: new Date().toISOString(),
};

// Simple auth functions
export const getCurrentUser = async (): Promise<User | null> => {
  // For now, return mock user
  // In production, this would check session/token
  return mockUser;
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  // Mock sign in - in production, this would validate credentials
  console.log('Sign in with:', email);
  return mockUser;
};

export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User | null> => {
  // Mock sign up - in production, this would create user
  console.log('Sign up with:', email, displayName);
  return mockUser;
};

export const signOut = async (): Promise<void> => {
  // Mock sign out - in production, this would clear session
  console.log('Sign out');
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN';
};
