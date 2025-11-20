// * ==========================================================================
// *                 API ROUTE: EMAIL VERIFICATION (/api/auth/verify-email)
// * ==========================================================================

import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { AUTH_MESSAGES } from '@/lib/auth/constants/auth';
import { AUTH_PATHS, API_AUTH_PATHS } from '@/lib/constants/routes';
import { getEnvVar } from '@/lib/utils/env';

// ** GET Handler ** //
/**
 * Handles GET requests from the email verification link.
 * - Extracts the verification token from the URL.
 * - Validates the token (existence and expiration).
 * - Finds the associated user.
 * - Updates the user's emailVerified status.
 * - Deletes the used verification token.
 * - Redirects the user to the login page with a status parameter.
 */
export async function GET(request: NextRequest) {
  const loginUrl = `${getEnvVar('NEXT_PUBLIC_APP_URL')}${AUTH_PATHS.LOGIN}`;

  // * 1. Extract Token from URL
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    console.warn(`GET ${API_AUTH_PATHS.VERIFY_EMAIL}: Email verification attempt without token.`);
    // Redirect to login with error if no token is present
    return NextResponse.redirect(
      `${loginUrl}?error=${encodeURIComponent(AUTH_MESSAGES.ERROR_INVALID_TOKEN)}`
    );
  }

  try {
    // * 2. Find Verification Token in Database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }, // Assuming token is the unique identifier
    });

    // * 3. Validate Token Existence
    if (!verificationToken) {
      console.warn(`GET ${API_AUTH_PATHS.VERIFY_EMAIL}: Invalid verification token received: ${token.substring(0, 10)}...`);
      return NextResponse.redirect(
        `${loginUrl}?error=${encodeURIComponent(AUTH_MESSAGES.ERROR_INVALID_TOKEN)}`
      );
    }

    // * 4. Validate Token Expiration
    const hasExpired = new Date(verificationToken.expires) < new Date();
    if (hasExpired) {
      console.warn(`GET ${API_AUTH_PATHS.VERIFY_EMAIL}: Expired verification token used: ${token.substring(0, 10)}...`);
      // Important: Delete expired token to prevent replay attacks or clutter
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.redirect(
        `${loginUrl}?error=${encodeURIComponent(AUTH_MESSAGES.ERROR_INVALID_TOKEN)}` // Use same generic error
      );
    }

    // * 5. Find Associated User
    const existingUser = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!existingUser) {
      // This case should be rare if the token is valid, but handle defensively
      console.error(
        `GET ${API_AUTH_PATHS.VERIFY_EMAIL}: Verification token ${token.substring(0, 10)}... found, but user ${verificationToken.identifier} does not exist.`
      );
      await prisma.verificationToken.delete({ where: { token } }); // Clean up the orphaned token
      return NextResponse.redirect(
        `${loginUrl}?error=${encodeURIComponent(AUTH_MESSAGES.ERROR_DEFAULT)}` // Generic error
      );
    }

    // * 6. Update User Verification Status
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });
    console.log(`GET ${API_AUTH_PATHS.VERIFY_EMAIL}: Email verified successfully for: ${existingUser.email}`);

    // * 7. Delete Used Verification Token
    await prisma.verificationToken.delete({
      where: { token },
    });
    console.log(`GET ${API_AUTH_PATHS.VERIFY_EMAIL}: Verification token deleted: ${token.substring(0, 10)}...`);

    // * 8. Redirect to Login with Success Indicator
    return NextResponse.redirect(`${loginUrl}?verified=true`);

  } catch (error) {
    // * Handle Unexpected Errors
    console.error(`GET ${API_AUTH_PATHS.VERIFY_EMAIL}: Unexpected email verification error:`, error);
    return NextResponse.redirect(
      `${loginUrl}?error=${encodeURIComponent(AUTH_MESSAGES.ERROR_DEFAULT)}`
    );
  }
} 