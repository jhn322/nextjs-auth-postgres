'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { MailWarning, LogOut } from 'lucide-react';
import { APP_NAME } from '@/lib/constants/site';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { signOut } from 'next-auth/react';

function VerifyEmailContent() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleResendClick = async () => {
    if (!session?.user?.email) {
      toast.error('Could not get user email. Please log out and log back in.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Failed to resend verification email.'
        );
      }

      toast.success(
        responseData.message || 'Verification email sent successfully!'
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      console.error('Resend verification error:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading state while session is checked
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // If somehow user lands here without being logged in (middleware should prevent this)
  if (status === 'unauthenticated') {
    return (
      <div className="space-y-4 text-center">
        <MailWarning
          className={`mx-auto h-12 w-12 text-yellow-600`}
          aria-hidden="true"
        />
        <h2 className={`text-2xl font-semibold`}>Authentication Required</h2>
        <p className="text-muted-foreground">
          You need to be logged in to manage email verification.
        </p>
        <Button asChild variant="outline">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </div>
    );
  }

  // Main content for logged-in, unverified user
  return (
    <div className="space-y-4 text-center">
      <MailWarning
        className={`mx-auto h-12 w-12 text-yellow-600`}
        aria-hidden="true"
      />
      <h2 className={`text-2xl font-semibold`}>Verify Your Email</h2>
      <p className="text-muted-foreground">
        A verification link has been sent to{' '}
        <strong>{session?.user?.email || 'your email'}</strong>. Please check
        your inbox (and spam folder) and click the link to activate your
        account.
      </p>
      <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
        <Button onClick={handleResendClick} disabled={isLoading}>
          {isLoading ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Sending...' : 'Resend Verification Link'}
        </Button>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
        >
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md lg:w-[450px]">
        <Link href="/" className="mx-auto mb-8 inline-block">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center space-x-2 rounded-lg p-1.5">
            <Image
              className="h-10 w-auto"
              src="/logo.svg"
              alt={`${APP_NAME} Logo`}
              width={40}
              height={40}
            />
          </div>
        </Link>

        <VerifyEmailContent />
      </div>
    </div>
  );
}
