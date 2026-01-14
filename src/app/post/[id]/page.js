'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Eye, MessageCircle, ArrowLeft } from 'lucide-react'

import ShareButtons from '@/components/ShareButtons'
import RelatedPosts from '@/components/RelatedPosts'
import FeaturedSidebar from '@/components/FeaturedSidebar'

export default function PostDetailPage() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [commentForm, setCommentForm] = useState({
    comment: ''
  })
  const [submittingComment, setSubmittingComment] = useState(false)
  const [viewTracked, setViewTracked] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        if (response.ok) {
          const postData = await response.json()
          setPost(postData)
          
          // Track view count (only once per page load)
          if (!viewTracked) {
            trackView(params.id)
            setViewTracked(true)
          }
          
          // Fetch related posts
          fetchRelatedPosts(postData.category, params.id)
          
          // Fetch comments
          fetchComments(params.id)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id, viewTracked])

  const trackView = async (postId) => {
    try {
      await fetch(`/api/posts/${postId}/view`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const fetchRelatedPosts = async (category, excludeId) => {
    try {
      const response = await fetch(`/api/posts?category=${category}&limit=3&exclude=${excludeId}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    setSubmittingComment(true)

    try {
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentForm),
      })

      if (response.ok) {
        alert('Comment added successfully!')
        setCommentForm({ name: '', email: '', comment: '' })
        // Refresh comments to show the new comment immediately
        fetchComments(params.id)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleCommentChange = (e) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="mb-6 h-5 w-32 bg-gray-200 rounded" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-72 w-full bg-gray-200" />
                <div className="p-8 space-y-4">
                  <div className="h-6 w-24 bg-gray-200 rounded-full" />
                  <div className="h-8 w-3/4 bg-gray-200 rounded" />
                  <div className="flex space-x-4 mt-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-11/12 bg-gray-200 rounded" />
                    <div className="h-4 w-10/12 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Featured Image */}
              {post.imageUrl && (
                <div className="relative h-96 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="p-8">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center text-sm text-gray-500 mb-8 space-x-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{post.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    <span>{post.views || 0} views</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>{post.commentsCount || 0} comments</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-8">
                  <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={post.title} />
                </div>
              </div>
            </article>

            {/* Related Posts Section */}
            <RelatedPosts postId={post._id} category={post.category} limit={3} />

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  name="comment"
                  value={commentForm.comment}
                  onChange={handleCommentChange}
                  placeholder="Write your comment..."
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submittingComment ? 'Submitting...' : 'Submit Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-gray-900">Anonymous</h4>
                      <span className="text-gray-500 text-sm ml-2">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Featured Posts */}
          <div className="lg:col-span-1">
            <FeaturedSidebar currentPostId={post._id} />
          </div>
        </div>
      </div>
    </div>
  )
}