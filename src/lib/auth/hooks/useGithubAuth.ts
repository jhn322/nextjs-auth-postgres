import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  AUTH_MESSAGES,
  DEFAULT_LOGIN_REDIRECT,
} from '@/lib/auth/constants/auth';

interface UseGithubAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useGithubAuth = ({
  onSuccess,
  onError,
}: UseGithubAuthProps = {}) => {
  const [loading, setLoading] = useState(false);

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn('github', {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
        redirect: false,
      });

      if (result?.error) {
        onError?.(
          new Error(result.error || AUTH_MESSAGES.ERROR_GITHUB_SIGNIN_FAILED)
        );
      } else if (result?.ok) {
        onSuccess?.();
      }
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error
          : new Error(AUTH_MESSAGES.ERROR_GITHUB_SIGNIN_FAILED)
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGithubSignIn,
  };
};
