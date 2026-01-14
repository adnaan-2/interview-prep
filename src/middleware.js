import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    console.log('🔒 Middleware check for path:', pathname);
    console.log('🔑 User authenticated:', !!token);
    
    // Allow all authenticated users to access admin pages
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token // Require authentication
    }
  }
);

export const config = {
  matcher: ['/admin/:path*']
};