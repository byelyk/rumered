// Neon Auth configuration
// This will be used instead of StackAuth

// Note: We'll use Prisma for database operations instead of direct Neon client
// This avoids client-side database connection issues

// Simple auth utilities for Neon Auth
export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// Mock user for development (removed unused variable)

// Simple auth functions
export const getCurrentUser = async (): Promise<User | null> => {
  // Check localStorage for stored user
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('rumered-user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  }
  return null;
};

export const signIn = async (
  email: string,
  _password: string
): Promise<User | null> => {
  // Mock sign in - in production, this would validate credentials
  console.log('Sign in with:', email);

  // Create user and store in localStorage for demo
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    displayName: email.split('@')[0],
    role: 'USER',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('rumered-user', JSON.stringify(user));
  }

  return user;
};

export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User | null> => {
  // Mock sign up - in production, this would create user
  console.log('Sign up with:', email, displayName);

  // Create user and store in localStorage for demo
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    displayName: displayName || email.split('@')[0],
    role: 'USER',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('rumered-user', JSON.stringify(user));
  }

  return user;
};

export const signOut = async (): Promise<void> => {
  // Mock sign out - in production, this would clear session
  console.log('Sign out');

  // Clear user from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rumered-user');
  }
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN';
};
