import { JWT } from 'next-auth/jwt';
import { Session, User, Account, Profile } from 'next-auth';
import prisma from '@/lib/prisma';
import { USER_ROLES } from '@/lib/auth/constants/auth';

//* Callback-functions for NextAuth.js

export const configureCallbacks = () => ({
  /**
   ** Runs when a user is successfully authenticated.
   ** This is where you can run any custom logic, such as creating or linking
   ** accounts, sending emails, etc.
   */
  async signIn({
    user,
    account,
  }: {
    user: User;
    account: Account | null;
    _profile?: Profile;
  }): Promise<boolean | string> {
    // If the user is already logged in, return true
    if (account && account.provider !== 'credentials' && user.email) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        // If the user is not found, create a new user
        if (
          existingUser &&
          !existingUser.accounts.some(
            (acc) =>
              acc.provider === account.provider &&
              acc.providerAccountId === account.providerAccountId
          )
        ) {
          // Create a new account for the user
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              id_token: account.id_token,
              scope: account.scope,
              session_state: account.session_state,
              token_type: account.token_type,
            },
          });

          // Update the user's name and image
          // await prisma.user.update({ where: { id: existingUser.id }, data: { name: user.name, image: user.image } });
        }
      } catch (error) {
        console.error('AUTH: Error linking account in signIn callback:', error);
        // return false;
      }
    }
    // Always return true to indicate a successful authentication
    return true;
  },

  /**
   * JWT-callback runs when a user is successfully authenticated and returns a JWT.
   */
  async jwt({
    token,
    user,
    trigger,
    session,
  }: {
    token: JWT;
    user?: User;
    _account?: Account | null;
    trigger?: 'signIn' | 'signUp' | 'update';
    session?: { name?: string; image?: string };
  }) {
    if (trigger === 'update' && session?.name) {
      token.name = session.name;
    }

    if (user) {
      // Add the user's role to the JWT payload
      // Fetch the user from the database and add their role
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser) {
        token.role = dbUser.role;
        // Also ensure name is up to date from DB if not just updated
        if (trigger !== 'update') {
           token.name = dbUser.name;
        }
      } else {
        // Fallback to default role if user is not found in the database
        token.role = USER_ROLES.USER;
        console.error(
          `AUTH: User with id ${user.id} not found in JWT callback`
        );
      }
    }
    return token;
  },

  /**
   * Session-callback runs when a user is successfully authenticated and returns a session.
   */
  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user && token.sub) {
      session.user.id = token.sub;
      if (token.role) {
        session.user.role = token.role as string;
      }
    }
    return session;
  },
});
