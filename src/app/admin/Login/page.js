'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/context/PostContext'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = usePosts()
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    if (login(password)) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password. Use: admin123')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Demo password: admin123
        </p>
      </div>
    </div>
  )
}
