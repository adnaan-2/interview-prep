'use client'
import { useState, useEffect, useCallback } from 'react'
import { User, Send } from 'lucide-react'

export default function Comments({ postId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Memoize fetchComments to avoid unnecessary re-renders
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/comments?postId=${postId}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch comments')
      }
      
      const data = await res.json()
      setComments(data.comments || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Could not load comments. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  // Fetch comments when component mounts
  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId, fetchComments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (!newComment.trim()) {
      setError('Please enter a comment')
      return
    }
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId,
          userName: userName.trim(),
          content: newComment.trim()
        })
      })
      
      if (!res.ok) {
        throw new Error('Failed to post comment')
      }
      
      const data = await res.json()
      
      // Add the new comment to the beginning of the list
      setComments([data.comment, ...comments])
      
      // Clear comment (but keep the name)
      setNewComment('')
      setError('')
    } catch (err) {
      console.error('Error posting comment:', err)
      setError('Failed to post comment. Please try again.')
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium mb-1 text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-1 text-gray-700">
            Your Comment
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Share your thoughts on this article..."
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Send className="w-4 h-4 mr-1" />
          Post Comment
        </button>
      </form>
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-red-600 border-r-2 border-b-2 border-gray-200"></div>
            <p className="mt-2 text-gray-500">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment._id || index} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-red-100 text-red-600 p-2 rounded-full mr-2">
                    <User size={16} />
                  </div>
                  <span className="font-medium">{comment.userName}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-700 pl-10">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}