import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    console.log('🔒 Middleware check for path:', pathname);
    console.log('🔑 User token:', token);
    
    // Check if user is trying to access admin pages
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      console.log('❌ Non-admin user tried to access admin area');
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
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