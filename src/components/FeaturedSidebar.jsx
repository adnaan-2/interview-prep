'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CloudinaryImage from './CloudinaryImage';
import { Clock } from 'lucide-react';

export default function FeaturedSidebar({ currentPostId }) {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedPosts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts?limit=5&exclude=${currentPostId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured posts');
        }
        
        const data = await response.json();
        setFeaturedPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeaturedPosts();
  }, [currentPostId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="mb-6">
            <div className="h-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-20">
      <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Popular Articles</h3>
      <div className="space-y-6">
        {featuredPosts.map(post => {
          const isCloudinaryImage = post.imageUrl && post.imageUrl.includes('cloudinary.com');
          
          return (
            <div key={post._id} className="group">
              <Link href={`/post/${post._id}`} className="flex flex-col space-y-2">
                {/* Image */}
                <div className="relative h-40 w-full">
                  {isCloudinaryImage ? (
                    <CloudinaryImage 
                      src={post.imageUrl} 
                      alt={post.title}
                      fill
                      className="object-cover rounded"
                    />
                  ) : post.imageUrl ? (
                    <Image 
                      src={post.imageUrl} 
                      alt={post.title}
                      fill
                      className="object-cover rounded"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 m-2 bg-red-600 text-white text-xs px-2 py-0.5 uppercase font-semibold rounded-sm">
                    {post.category}
                  </div>
                </div>
                
                {/* Title */}
                <h4 className="font-semibold line-clamp-2 group-hover:text-red-600 transition-colors">
                  {post.title}
                </h4>
                
                {/* Date */}
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      
      {/* "See more" link */}
      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          View More Articles →
        </Link>
      </div>
    </div>
  );
}