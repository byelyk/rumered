// Neon Auth utilities
import {
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  type User,
} from './neon-auth';
import { useState, useEffect } from 'react';

export const useUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return loading ? null : user;
};

export const useStackApp = () => ({
  signIn: async (email: string, password: string) => {
    try {
      const user = await signIn(email, password);
      if (user) {
        window.location.reload(); // Refresh to update user state
      }
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
    }
  },
  signUp: async (email: string, password: string, displayName?: string) => {
    try {
      const user = await signUp(email, password, displayName);
      if (user) {
        window.location.reload(); // Refresh to update user state
      }
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      return null;
    }
  },
  signOut: async () => {
    try {
      await signOut();
      window.location.reload(); // Refresh to clear user state
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
});
