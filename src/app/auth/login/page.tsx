'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { GithubButton } from '@/components/auth/GithubButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthForm } from '@/lib/auth/hooks/useAuthForm';
import type { AuthFormData } from '@/components/auth/AuthForm/types';
import { useGoogleAuth } from '@/lib/auth/hooks/useGoogleAuth';
import { useGithubAuth } from '@/lib/auth/hooks/useGithubAuth';
import { useRedirect } from '@/lib/auth/hooks/useRedirect';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/constants/auth';
import { useAuth } from '@/context/auth-context';
import { Spinner } from '@/components/ui/spinner';
import { APP_NAME } from '@/lib/constants/site';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { redirectToCallback } = useRedirect();
  const { status } = useAuth();
  const authenticated = status === 'authenticated';
  const authLoading = status === 'loading';

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified successfully! You can now log in.');
    }
    // if (searchParams.get("unverified") === "true") {
    //   toast.error("Please verify your email before accessing that page.");
    // }
  }, [searchParams, router]);

  const {
    loading: formLoading,
    error,
    handleSubmit,
    setError,
  } = useAuthForm({
    mode: 'login',
    onSuccess: redirectToCallback,
  });

  const { loading: googleLoading, handleGoogleSignIn } = useGoogleAuth({
    onSuccess: redirectToCallback,
    onError: (error) => setError(error.message),
  });

  const { loading: githubLoading, handleGithubSignIn } = useGithubAuth({
    onSuccess: redirectToCallback,
    onError: (error) => setError(error.message),
  });

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.push(DEFAULT_LOGIN_REDIRECT);
    }
  }, [authenticated, authLoading, router]);

  const isLoading =
    formLoading || googleLoading || githubLoading || authLoading;

  if (authLoading || (!authLoading && authenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const handleFormSubmit = handleSubmit as (
    data: AuthFormData
  ) => Promise<void>;

  return (
    <div className="bg-background flex min-h-screen">
      <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="mb-6 inline-block">
              <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center space-x-2 rounded-lg p-1.5">
                <Image
                  className="h-10 w-auto"
                  src="/logo.svg"
                  alt={`${APP_NAME} Logo`}
                  width={40}
                  height={40}
                />
                <span className="p-2 text-2xl font-bold tracking-tight whitespace-nowrap">
                  {APP_NAME}
                </span>
              </div>
            </Link>
            <h2 className="text-foreground mt-4 text-2xl leading-9 font-bold tracking-tight sm:text-3xl">
              Sign in to your account
            </h2>
            <p className="text-md text-muted-foreground mt-2 leading-6">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary/90 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="space-y-3">
              <GoogleButton
                mode="login"
                onSuccess={handleGoogleSignIn}
                isLoading={isLoading}
              />
              <GithubButton
                mode="login"
                onSuccess={handleGithubSignIn}
                isLoading={isLoading}
              />
            </div>
            <AuthDivider text="Or sign in with email" />
            <AuthForm
              mode="login"
              onSubmit={handleFormSubmit}
              isLoading={formLoading}
              error={error}
            />
            <div className="text-right text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-primary hover:text-primary/90 font-semibold"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/placeholder.webp"
          alt="Sign in illustration"
          fill
          priority
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
