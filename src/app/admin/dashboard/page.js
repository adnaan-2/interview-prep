'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  PlusCircle, 
  FileText, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  Edit,
  Trash2,
  Calendar,
  
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
      router.push('/auth/login')
      return
    }

    fetchDashboardData()
  }, [status, session, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch recent posts
      const postsResponse = await fetch('/api/posts?limit=10')
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setRecentPosts(postsData.posts || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Post deleted successfully')
        fetchDashboardData() // Refresh data
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name || 'Admin'}</p>
        </div>
        <Link
          href="/admin/posts/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Post
        </Link>
      </div>

      {/* Stats Overview Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStats.totalPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStats.totalComments}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Posts with Stats */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Recent Posts & Performance</h2>
                <Link href="/admin/posts" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Posts →
                </Link>
              </div>
            </div>
            <div className="overflow-hidden">
              {recentPosts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentPosts.map((post) => (
                    <div key={post._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {post.title}
                          </h3>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {post.category}
                            </span>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(post.createdAt)}
                            </div>
                          </div>
                          
                          {/* Post Stats */}
                          <div className="mt-3 flex items-center space-x-6 text-sm">
                            <div className="flex items-center text-green-600">
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="font-medium">{post.views || 0}</span>
                              <span className="ml-1">views</span>
                            </div>
                            <div className="flex items-center text-purple-600">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              <span className="font-medium">{post.commentsCount || 0}</span>
                              <span className="ml-1">comments</span>
                            </div>
                            <div className="flex items-center text-blue-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span className="font-medium">
                                {post.views > 0 ? ((post.commentsCount || 0) / post.views * 100).toFixed(1) : '0'}%
                              </span>
                              <span className="ml-1">engagement</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            href={`/post/${post._id}`}
                            className="text-gray-400 hover:text-blue-600 p-2"
                            title="View Post"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/posts/edit/${post._id}`}
                            className="text-gray-400 hover:text-green-600 p-2"
                            title="Edit Post"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="text-gray-400 hover:text-red-600 p-2"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar with Top Performing Posts and Quick Stats */}
        <div className="space-y-6">
          {/* Top Performing Posts */}
          {stats && stats.mostViewedPosts && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Top Performing Posts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.mostViewedPosts.slice(0, 5).map((post, index) => (
                    <div key={post._id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-green-600 font-medium">{post.views} views</span>
                          <span className="text-xs text-purple-600 font-medium">{post.commentsCount} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Performance */}
          {stats && stats.categoryStats && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Category Performance</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.categoryStats.slice(0, 6).map((category) => (
                    <div key={category._id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{category._id}</p>
                        <p className="text-xs text-gray-500">{category.count} posts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">{category.totalViews}</p>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          
        </div>
      </div>
    </div>
  )
}
