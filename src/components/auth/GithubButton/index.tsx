'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { GithubIcon } from './GithubIcon';
import type { GithubButtonProps } from './types';
import {
  AUTH_MESSAGES,
  DEFAULT_LOGIN_REDIRECT,
} from '@/lib/auth/constants/auth';
import { Loader2 } from 'lucide-react';

export const GithubButton = ({
  mode,
  onSuccess,
  onError,
  isLoading = false,
}: GithubButtonProps) => {
  const handleGithubSignIn = async () => {
    try {
      const result = await signIn('github', {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
        redirect: false,
      });

      if (result?.error) {
        onError?.(
          new Error(result.error || AUTH_MESSAGES.ERROR_GITHUB_SIGNIN_FAILED)
        );
      } else if (result?.ok && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error
          : new Error(AUTH_MESSAGES.ERROR_GITHUB_SIGNIN_FAILED)
      );
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full"
      onClick={handleGithubSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {mode === 'login' ? 'Signing in...' : 'Signing up...'}
        </>
      ) : (
        <>
          <GithubIcon />
          {mode === 'login' ? 'Sign in with GitHub' : 'Sign up with GitHub'}
        </>
      )}
    </Button>
  );
};
