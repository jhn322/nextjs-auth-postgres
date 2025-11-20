// Assuming utils and constants are in lib/auth/utils and lib/auth/constants
import { getEnvVar } from '@/lib/utils/env';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { AUTH_MESSAGES, USER_ROLES } from '@/lib/auth/constants/auth';

/**
 * Provider-configuration for NextAuth
 */
export const configureProviders = () => [
  GoogleProvider({
    clientId: getEnvVar('GOOGLE_CLIENT_ID'),
    clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role: USER_ROLES.USER,
      };
    },
  }),
  GitHubProvider({
    clientId: getEnvVar('GITHUB_CLIENT_ID'),
    clientSecret: getEnvVar('GITHUB_CLIENT_SECRET'),
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
        role: USER_ROLES.USER,
      };
    },
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Lösenord', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error(AUTH_MESSAGES.ERROR_MISSING_FIELDS);
      }

      // Convert email to lowercase before database lookup
      const lowerCaseEmail = credentials.email.toLowerCase();

      const user = await prisma.user.findUnique({
        where: { email: lowerCaseEmail }, // Use lowercased email for lookup
      });

      if (!user || !user.password) {
        // User not found (or OAuth user trying to login with credentials)
        console.warn(
          `Login attempt failed for ${lowerCaseEmail}: User not found or no password set.`
        );
        throw new Error('User not found'); // Keep error generic for security
      }

      // Validate password first
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        // Use a specific internal error to indicate incorrect password
        throw new Error('Incorrect password');
      }

      // Check if user has verified their email first after password is validated
      if (!user.emailVerified) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      return user;
    },
  }),
];
