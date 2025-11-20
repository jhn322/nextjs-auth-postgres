import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import {
  AUTH_PATHS,
  DEFAULT_LOGIN_REDIRECT_PATH,
  // PUBLIC_ROUTE_PATTERNS, // Not directly used for an explicit check if isPublicPage is removed
  PROTECTED_PATHS,
  API_AUTH_ROUTE_PREFIX,
  // ROOT_PATH, // Not explicitly used in this basic version but good to have in constants
} from '@/lib/constants/routes';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_ROUTE_PREFIX);
  // Check if the current path starts with any of the protected base paths
  // For this project, primarily PROTECTED_PATHS.SETTINGS_BASE
  const isProtectedRoute = nextUrl.pathname.startsWith(
    PROTECTED_PATHS.SETTINGS_BASE
  );

  // PUBLIC_ROUTE_PATTERNS is not explicitly used here anymore because public routes
  // are those that don't fall into other categories (isApiAuthRoute, or isProtectedRoute without auth).
  // const isPublicPage = PUBLIC_ROUTE_PATTERNS.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    // Allow all API authentication requests (e.g., /api/auth/signin, /api/auth/callback/*)
    return NextResponse.next();
  }

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect unauthenticated users trying to access protected routes to the login page.
    // Preserve the intended destination via callbackUrl.
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const loginUrl = new URL(AUTH_PATHS.LOGIN, nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    console.log(
      `Middleware: Unauthenticated access to ${nextUrl.pathname}, redirecting to ${loginUrl.toString()}`
    );
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login/register pages, redirect to default logged-in page.
  if (
    isAuthenticated &&
    (nextUrl.pathname === AUTH_PATHS.LOGIN ||
      nextUrl.pathname === AUTH_PATHS.REGISTER)
  ) {
    console.log(
      `Middleware: Authenticated user accessing ${nextUrl.pathname}, redirecting to ${DEFAULT_LOGIN_REDIRECT_PATH}`
    );
    return NextResponse.redirect(
      new URL(DEFAULT_LOGIN_REDIRECT_PATH, nextUrl.origin)
    );
  }

  // For any other route that is not explicitly public and not protected (e.g. /unknown-path)
  // or if it's a public page, allow access.
  // If it's a protected route and user is authenticated, also allow.
  // This simplistic check might need refinement for more complex scenarios (e.g. specific public API routes not under /api/auth)
  // For now, if it's not an API auth route, and not a protected route that requires auth, let it pass.
  // If it IS a protected route and user IS authenticated, it will also pass here.
  return NextResponse.next();
}

// Configure the matcher to run middleware on specific paths.
export const config = {
  matcher: [
    // Match all routes except for those starting with:
    // - api (excluding /api/auth which we want to process for specific rules, though API_AUTH_ROUTE_PREFIX handles it)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - files with extensions (e.g. .png, .svg)
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
