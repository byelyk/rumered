import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        });

        session.user.id = user.id;
        session.user.role = dbUser?.role || 'USER';
        session.user.displayName = dbUser?.displayName || session.user.name;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user
          await prisma.user.create({
            data: {
              email: user.email!,
              displayName: user.name || user.email!.split('@')[0],
              role: 'USER',
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  session: {
    strategy: 'database',
  },
};
