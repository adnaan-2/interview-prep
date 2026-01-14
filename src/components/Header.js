'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Search, User, LogOut } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-[#24292f] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#24292f] font-bold text-lg">N</span>
            </div>
            <span className="text-base font-semibold text-white whitespace-nowrap hidden sm:block">NewsHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 shrink-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[15px] text-white/90 hover:text-white font-normal transition-colors duration-200 whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm ml-auto">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search or jump to..."
                aria-label="Search posts"
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-gray-600 bg-[#010409] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs font-mono">
                /
              </span>
            </div>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-700 animate-pulse rounded-md"></div>
            ) : session ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-1.5 text-[15px] font-normal text-white hover:text-white/80 whitespace-nowrap transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <span className="text-white/70 text-sm">{session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-1.5 text-[15px] font-medium text-white rounded-md border border-gray-600 hover:border-gray-500 hover:bg-white/10 whitespace-nowrap transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 text-[15px] font-normal text-white hover:text-white/80 whitespace-nowrap transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-1.5 text-[15px] font-medium text-white rounded-md border border-gray-600 hover:border-gray-500 hover:bg-white/10 whitespace-nowrap transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden ml-auto text-white hover:text-white/80 transition-colors duration-200"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search or jump to..."
                  aria-label="Search posts"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-600 bg-[#010409] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-white/90 hover:text-white font-normal transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            {session ? (
              <div className="mt-4 space-y-2">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:text-white/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="px-4 py-2 text-sm text-white/70">
                  {session.user.name}
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white rounded-md border border-gray-600 hover:border-gray-500 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-normal text-white hover:text-white/80 whitespace-nowrap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white rounded-md border border-gray-600 hover:border-gray-500 hover:bg-white/10 whitespace-nowrap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}