import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { configureProviders } from './providers';
import { configureCallbacks } from './callbacks';
import { USER_ROLES } from '@/lib/auth/constants/auth';
import { AUTH_PATHS } from '@/lib/constants/routes';

/**
 * Main configuration for NextAuth
 */
export const authOptions: NextAuthOptions = {
  // Adapter to connect NextAuth to Prisma
  adapter: PrismaAdapter(prisma) as Adapter,

  // Providers for various login methods
  providers: configureProviders(),

  // Session-handling
  session: {
    strategy: 'jwt',
  },

  // Custom pages
  pages: {
    signIn: AUTH_PATHS.LOGIN,
    error: AUTH_PATHS.AUTH_ERROR,
    // signOut: AUTH_PATHS.LOGOUT, // Optional: if you have a custom signout page
    // verifyRequest: AUTH_PATHS.VERIFY_EMAIL_REQUEST, // Optional: for email verification request page
    // newUser: AUTH_PATHS.REGISTER, // Optional: if you want to redirect new users to register or a welcome page
  },

  // Callbacks to customize JWT and session
  callbacks: configureCallbacks(),

  // Events for authentication
  events: {
    /**
     * Handles user login specifically for OAuth authentication (Google and GitHub)
     * - If the user exists: Update name and profile image
     * - If new user: Create account with USER role
     * This ensures that the database is kept in sync with OAuth profile data
     */
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Update or create user with correct role
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
          },
          create: {
            email: user.email!,
            name: user.name!,
            image: user.image,
            role: USER_ROLES.USER,
            emailVerified: new Date(),
          },
        });
      }
    },
  },

  // Enable debugging in development environment
  debug: process.env.NODE_ENV === 'development',
};
