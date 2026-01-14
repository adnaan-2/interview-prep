'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function FeaturedPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts?featured=true&limit=50')
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Homepage
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Featured Posts</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {posts.map(post => (
            <div 
              key={post._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/post/${post._id}`} className="block">
                <div className="relative h-48 w-full">
                  {post.imageUrl ? (
                    <Image 
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <div className="bg-red-600 text-white text-xs px-2 py-1 uppercase font-semibold rounded-full">
                      {post.category}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">{post.excerpt || post.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <span className="text-red-600 text-sm font-medium">Read more</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Show message if no posts */}
        {posts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-xl text-gray-600">No featured posts available.</h2>
            <p className="mt-2 text-gray-500">Featured posts will appear here once they are marked as featured.</p>
          </div>
        )}
      </div>
    </div>
  )
}