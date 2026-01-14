"use client";

import { SessionProvider } from "next-auth/react";
import { PostProvider } from '@/context/PostContext';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <PostProvider>
        {children}
      </PostProvider>
    </SessionProvider>
  );
}