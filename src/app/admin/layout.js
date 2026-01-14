"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple authentication check
    if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session.user.role === 'admin') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        
        {/* Main content */}
        <div className="flex-1">
          <header className="bg-white shadow">
            <div className="mx-auto px-4 py-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center">
                <span className="mr-4">Welcome, {session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          <main className="mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return null;
}