'use client'
import { useState, useEffect } from 'react'
import BlogCard from '@/components/BlogCard'

export default function HealthPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts?category=health')
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('Error fetching health posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Health News</h1>
        {posts.length === 0 ? (
          <p className="text-gray-600 text-center py-12">No health posts available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}