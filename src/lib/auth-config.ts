import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Get user from database to check role
        const dbUser = await db.user.findUnique({
          where: { email: session.user.email! },
        });

        // Extend session user with additional properties
        const extendedUser = session.user as typeof session.user & {
          id: string;
          role?: string;
          displayName?: string;
        };

        extendedUser.id = user.id;
        extendedUser.role = dbUser?.role || 'USER';
        extendedUser.displayName =
          dbUser?.displayName || session.user.name || undefined;
      }
      return session;
    },
    async signIn() {
      // Allow all sign-ins - PrismaAdapter will handle user creation
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
};
