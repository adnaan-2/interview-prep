'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, TrendingUp, ChevronRight, Sparkles, Star } from 'lucide-react'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm] = useState('')
  const router = useRouter()

  // Handle admin search
  useEffect(() => {
    if (searchTerm.toLowerCase() === 'admin') {
      router.push('/admin/login')
    }
  }, [searchTerm, router])

  // Load posts from API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts?limit=50')
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

  const categories = [
    'business', 'tech', 'weather', 'automotive', 'pakistan', 'global', 
    'health', 'sports', 'islam', 'education', 'entertainment'
  ]
  
  // Advanced dark gradient color schemes with premium feel
  const categoryColors = {
    'business': 'from-slate-900 via-blue-900 to-indigo-900',
    'tech': 'from-purple-900 via-violet-800 to-fuchsia-900',
    'weather': 'from-cyan-900 via-blue-800 to-sky-900',
    'automotive': 'from-gray-900 via-slate-800 to-zinc-900',
    'pakistan': 'from-emerald-900 via-green-800 to-teal-900',
    'global': 'from-teal-900 via-cyan-800 to-blue-900',
    'health': 'from-rose-900 via-pink-800 to-red-900',
    'sports': 'from-orange-900 via-amber-800 to-yellow-900',
    'islam': 'from-green-900 via-emerald-800 to-teal-900',
    'education': 'from-amber-900 via-yellow-800 to-orange-900',
    'entertainment': 'from-fuchsia-900 via-purple-800 to-pink-900'
  }

  // Category accent colors for highlights
  const categoryAccents = {
    'business': 'from-blue-400 to-indigo-500',
    'tech': 'from-purple-400 to-violet-500',
    'weather': 'from-cyan-400 to-blue-500',
    'automotive': 'from-gray-400 to-slate-500',
    'pakistan': 'from-emerald-400 to-green-500',
    'global': 'from-teal-400 to-cyan-500',
    'health': 'from-rose-400 to-pink-500',
    'sports': 'from-orange-400 to-amber-500',
    'islam': 'from-green-400 to-emerald-500',
    'education': 'from-amber-400 to-yellow-500',
    'entertainment': 'from-fuchsia-400 to-purple-500'
  }

  // Get featured posts (up to 18)
  const featuredPosts = posts.filter(post => post.featured).slice(0, 18)
  
  // If not enough featured posts, add some recent posts to make up the number
  const recentPosts = posts
    .filter(post => !post.featured)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  const displayedFeaturedPosts = 
    featuredPosts.length < 18 
      ? [...featuredPosts, ...recentPosts.slice(0, 18 - featuredPosts.length)]
      : featuredPosts
  
  // Group posts by category
  const getPostsByCategory = () => {
    const result = {}
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.category === category)
      result[category] = categoryPosts.slice(0, 4)
    })
    return result
  }

  const postsByCategory = getPostsByCategory()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border-t-4 border-b-4 border-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="absolute inset-0 h-20 w-20 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Featured Posts Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white py-8 sm:py-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-40 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-6 sm:mb-12">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Latest News and Updates
                </h2>
                <p className="text-gray-400 text-sm mt-1">Latest stories around the world</p>
              </div>
            </div>
            <Link 
              href="/featured"
              className="group flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles className="mr-2" size={16} />
              Explore All 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8">
            {/* Hero featured post */}
            {displayedFeaturedPosts.length > 0 && (
              <div className="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 xl:row-span-2 group">
                <div className="relative bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] border border-gray-700/50">
                  <Link href={`/post/${displayedFeaturedPosts[0]._id}`} className="block h-full">
                    <div className="relative h-52 sm:h-72 md:h-80 xl:h-[28rem] w-full">
                      {displayedFeaturedPosts[0].imageUrl ? (
                        <Image 
                          src={displayedFeaturedPosts[0].imageUrl}
                          alt={displayedFeaturedPosts[0].title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <Star className="text-gray-500" size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 uppercase font-bold rounded-full shadow-lg">
                          Featured
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                        <div className={`bg-gradient-to-r ${categoryAccents[displayedFeaturedPosts[0].category] || 'from-blue-400 to-indigo-500'} text-white text-xs px-3 py-1.5 uppercase font-semibold rounded-full inline-block mb-3 shadow-lg`}>
                          {displayedFeaturedPosts[0].category}
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-white mb-2 sm:mb-4 line-clamp-3 leading-tight">
                          {displayedFeaturedPosts[0].title}
                        </h3>
                        <div className="flex items-center text-gray-300 text-sm">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></div>
                          {new Date(displayedFeaturedPosts[0].createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Other featured posts */}
            {displayedFeaturedPosts.slice(1, 19).map((post) => (
              <div 
                key={post._id} 
                className="group bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.05] border border-gray-700/30 hover:border-purple-500/50"
              >
                <Link href={`/post/${post._id}`} className="block h-full">
                  <div className="relative h-36 sm:h-52 w-full overflow-hidden">
                    {post.imageUrl ? (
                      <Image 
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <Star className="text-gray-500" size={24} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <div className={`bg-gradient-to-r ${categoryAccents[post.category] || 'from-blue-400 to-indigo-500'} text-white text-[10px] sm:text-xs px-2 py-1 uppercase font-bold rounded-full shadow-md`}>
                        {post.category}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-xs sm:text-sm text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-gray-400 text-[10px] sm:text-xs">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Category sections with advanced dark gradients */}
        {categories.map(category => (
          postsByCategory[category]?.length > 0 && (
            <div key={category} className={`mb-12 sm:mb-16 rounded-2xl bg-gradient-to-br ${categoryColors[category]} p-6 sm:p-8 border border-gray-700/30 shadow-2xl relative overflow-hidden`}>
              {/* Subtle animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <div className="flex items-center">
                    <div className={`p-3 bg-gradient-to-r ${categoryAccents[category]} rounded-xl mr-4 shadow-lg`}>
                      <div className="w-6 h-6 bg-white rounded-sm"></div>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-3xl font-bold text-white capitalize mb-1">
                        {category} News
                      </h2>
                      <p className="text-gray-300 text-sm">Latest updates and stories</p>
                    </div>
                  </div>
                  <Link 
                    href={`/category/${category}`}
                    className="group flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all duration-300 text-sm font-medium border border-white/20 hover:border-white/40"
                  >
                    View All 
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {postsByCategory[category].map(post => (
                    <div 
                      key={post._id}
                      className="group bg-black/20 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-white/10 hover:border-white/30 transform hover:scale-[1.02]"
                    >
                      <Link href={`/post/${post._id}`} className="block h-full flex flex-col">
                        <div className="relative h-32 sm:h-44 w-full overflow-hidden">
                          {post.imageUrl ? (
                            <Image 
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
                              <Star className="text-gray-400" size={24} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-2 left-2">
                            <div className={`bg-gradient-to-r ${categoryAccents[category]} text-white text-[10px] px-2 py-1 uppercase font-bold rounded-md shadow-md`}>
                              {post.category}
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-3 sm:p-4 flex flex-col flex-grow">
                          <h3 className="font-bold text-xs sm:text-sm text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors leading-tight">
                            {post.title}
                          </h3>
                          
                          <div className="flex justify-between items-center mt-auto">
                            <div className="flex items-center text-gray-400 text-[10px] sm:text-xs">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <span className={`bg-gradient-to-r ${categoryAccents[category]} bg-clip-text text-transparent text-[10px] sm:text-xs font-bold group-hover:scale-105 transition-transform`}>
                              Read more
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ))}

        {/* Empty state with style */}
        {posts.length === 0 && (
          <div className="text-center py-12 sm:py-20 bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/30">
            <div className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Star className="text-purple-400" size={48} />
            </div>
            <h2 className="text-xl sm:text-2xl text-white font-bold mb-2">No Posts Available</h2>
            <p className="text-gray-400">Create some amazing content from the admin panel!</p>
          </div>
        )}
      </div>
    </div>
  )
}