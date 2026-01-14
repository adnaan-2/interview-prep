'use client'
import Link from 'next/link'
import { Calendar, User, ArrowRight, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function BlogCard({ post, featured = false }) {
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    if (!post || typeof post !== 'object') {
      console.error('Invalid post object provided to BlogCard');
    }
  }, [post]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  }

  const truncateText = (text, maxWords = 15) => {
    if (!text) return 'No content available';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }

  const truncateTitle = (title, maxLength = 60) => {
    if (!title) return 'Untitled Post';
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  }

  if (!post || typeof post !== 'object') {
    return null;
  }

  // Handle different image sources
  const getImageSrc = () => {
    if (imageError || !post.imageUrl) {
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=center";
    }
    
    // If it's already a full Cloudinary URL, use it directly
    if (post.imageUrl.startsWith('http')) {
      return post.imageUrl;
    }
    
    // If it's a relative path, assume it's a Cloudinary public_id and construct the URL
    if (post.imageUrl.includes('cloudinary')) {
      return post.imageUrl;
    }
    
    // Default fallback
    return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=center";
  };

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col">
      <Link href={`/post/${post._id}`} className="block">
        {/* Image section - Fixed height */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={getImageSrc()}
            alt={post.title || 'Blog post image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            priority={featured}
            onError={() => setImageError(true)}
            unoptimized={post.imageUrl && post.imageUrl.includes('cloudinary')}
          />
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider">
              {post.category || 'Uncategorized'}
            </span>
          </div>
        </div>
      </Link>

      {/* Content section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Meta information */}
        <div className="flex items-center text-sm text-gray-500 mb-3 h-5">
          <div className="flex items-center mr-4">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{post.author?.name || 'Admin'}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/post/${post._id}`} className="block mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 h-12 line-clamp-2 leading-6">
            {truncateTitle(post.title)}
          </h3>
        </Link>

        {/* Excerpt */}
        <div className="flex-grow mb-4">
          <p className="text-gray-600 text-sm leading-relaxed h-16 line-clamp-3">
            {truncateText(post.content, 20)}
          </p>
        </div>

        {/* Comments count (if you have it) */}
        {post.commentsCount > 0 && (
          <div className="flex items-center text-sm text-gray-500 mb-3 py-2 border-t border-gray-100">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span>{post.commentsCount} comments</span>
          </div>
        )}

        {/* Read more link */}
        <div className="mt-auto">
          <Link 
            href={`/post/${post._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:gap-2 transition-all duration-200"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  )
}