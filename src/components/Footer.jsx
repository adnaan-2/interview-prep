'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🇵🇰</span>
              </div>
              <span className="text-xl font-bold">Pakistan News</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted source for breaking news, expert insights, and trending stories from Pakistan and around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link href="/category/national" className="text-gray-400 hover:text-white transition-colors duration-200">National</Link></li>
              <li><Link href="/category/global" className="text-gray-400 hover:text-white transition-colors duration-200">Global</Link></li>
              <li><Link href="/category/business" className="text-gray-400 hover:text-white transition-colors duration-200">Business</Link></li>
              <li><Link href="/category/technology" className="text-gray-400 hover:text-white transition-colors duration-200">Technology</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/health" className="text-gray-400 hover:text-white transition-colors duration-200">Health</Link></li>
              <li><Link href="/category/sports" className="text-gray-400 hover:text-white transition-colors duration-200">Sports</Link></li>
              <li><Link href="/category/entertainment" className="text-gray-400 hover:text-white transition-colors duration-200">Entertainment</Link></li>
              <li><Link href="/category/education" className="text-gray-400 hover:text-white transition-colors duration-200">Education</Link></li>
              <li><Link href="/category/weather" className="text-gray-400 hover:text-white transition-colors duration-200">Weather</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Pakistan News. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}