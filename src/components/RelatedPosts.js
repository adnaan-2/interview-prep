'use client';

import { useState, useEffect } from 'react';
import BlogCard from './BlogCard';

export default function RelatedPosts({ postId, category, limit = 3 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      if (!category) return;
      
      try {
        setLoading(true);
        // Fetch posts with same category but exclude current post
        const response = await fetch(`/api/posts?category=${category}&limit=${limit}&exclude=${postId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related posts');
        }
        
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRelatedPosts();
  }, [postId, category, limit]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}