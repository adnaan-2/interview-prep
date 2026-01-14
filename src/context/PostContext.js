"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context with default values
const PostContext = createContext({
  posts: [],
  featuredPosts: [],
  loading: false,
  error: null,
  setPosts: () => {},
  setFeaturedPosts: () => {},
  setLoading: () => {},
  setError: () => {},
});

// Provider component
export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load posts from localStorage on mount - safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPosts = localStorage.getItem('news-posts');
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        } else {
          // Add some demo posts
          const demoPosts = [
            {
              id: '1',
              title: 'Breaking: New Technology Trends for 2024',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              category: 'tech',
              createdAt: new Date().toISOString(),
              comments: []
            },
            {
              id: '2',
              title: 'Business Growth Strategies',
              content: 'Ut enim ad minim veniam, quis nostrud exercitation.',
              category: 'business',
              createdAt: new Date().toISOString(),
              comments: []
            }
          ];
          setPosts(demoPosts);
          localStorage.setItem('news-posts', JSON.stringify(demoPosts));
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    }
  }, []);

  // Save posts to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && posts.length > 0) {
      try {
        localStorage.setItem('news-posts', JSON.stringify(posts));
      } catch (error) {
        console.error('Error saving posts:', error);
      }
    }
  }, [posts]);

  // Value to be provided
  const value = {
    posts,
    setPosts,
    featuredPosts,
    setFeaturedPosts,
    loading,
    setLoading,
    error,
    setError,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

// Hook to use the context
export function usePosts() {
  const context = useContext(PostContext);
  
  if (typeof window !== 'undefined' && !context) {
    console.warn('usePosts must be used within a PostProvider');
  }
  
  return context;
}