'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, MessageCircle, TrendingUp, BarChart3 } from 'lucide-react'

export default function AdminStatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
      router.push('/auth/login')
      return
    }

    fetchStats()
  }, [status, session, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  if (!stats) {
    return <div>Failed to load stats</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Blog Statistics</h1>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Posts</p>
              <p className="text-2xl font-bold">{stats.totalStats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Views</p>
              <p className="text-2xl font-bold">{stats.totalStats.totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Comments</p>
              <p className="text-2xl font-bold">{stats.totalStats.totalComments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Pending Comments</p>
              <p className="text-2xl font-bold">{stats.totalStats.pendingComments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Most Viewed Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Most Viewed Posts</h2>
          <div className="space-y-3">
            {stats.mostViewedPosts.map((post, index) => (
              <div key={post._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{post.title}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{post.views} views</span>
                    <MessageCircle className="w-4 h-4 ml-4 mr-1" />
                    <span>{post.commentsCount} comments</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Category Statistics</h2>
          <div className="space-y-3">
            {stats.categoryStats.map((category) => (
              <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{category._id}</p>
                  <p className="text-sm text-gray-500">{category.count} posts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{category.totalViews} views</p>
                  <p className="text-sm text-gray-600">{category.totalComments} comments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Posts Table */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">All Posts Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.commentsCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}