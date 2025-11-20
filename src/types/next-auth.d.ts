import { DefaultSession, DefaultUser } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
