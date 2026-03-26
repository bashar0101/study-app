import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // This is a basic middleware. Real auth check should happen based on tokens/cookies
  // For now, we'll let the client-side handle most logic, or use a cookie if available.
  
  // In a real app, we'd check for a 'refreshToken' cookie or similar to decide whether to block
  // but since we are using localStorage for accessToken, we can't check it here (server-side).
  
  // We can however check for the Presence of a 'session' cookie if we set one on login
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
