'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lifestyleDropdownOpen, setLifestyleDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const searchRef = useRef(null)
  const router = useRouter()

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Search results with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults(searchQuery)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchSearchResults = async (query) => {
    if (!query.trim()) return

    try {
      setIsSearching(true)
      const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}&limit=5`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }
      
      const data = await response.json()
      setSearchResults(data.posts || [])
      setShowResults(true)
    } catch (searchError) {
      console.error('Error fetching search results:', searchError)
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim() === '') {
      setShowResults(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowResults(false)
      setShowMobileSearch(false)
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
  }

  const handleResultClick = (postId) => {
    router.push(`/post/${postId}`)
    setSearchQuery('')
    setShowResults(false)
    setShowMobileSearch(false)
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (showMobileSearch) {
      setShowMobileSearch(false)
    }
  }

  const toggleLifestyleDropdown = () => {
    setLifestyleDropdownOpen(!lifestyleDropdownOpen)
  }

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric'
    })
  }

  const highlightSearchTerm = (text) => {
    if (!searchQuery.trim()) return text
    
    try {
      const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
      return (
        <>
          {parts.map((part, i) => 
            part.toLowerCase() === searchQuery.toLowerCase() ? 
              <span key={i} className="bg-yellow-200 text-gray-900">{part}</span> : 
              part
          )}
        </>
      )
    } catch (highlightError) {
      console.error('Error highlighting text:', highlightError)
      return text
    }
  }

  return (
    <div className="bg-gray-900 text-white sticky top-0 z-50 border-b border-gray-700">
      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start pt-16">
          <div className="w-full px-4" ref={searchRef}>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold">Search</h3>
                <button onClick={toggleMobileSearch} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full py-3 pl-4 pr-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    value={searchQuery}
                    onChange={handleInputChange}
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    <Search size={20} className="text-gray-400" />
                  </button>
                </div>
                
                {showResults && (
                  <div className="mt-3 bg-gray-800 rounded-md border border-gray-700 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-gray-400">
                        <div className="animate-pulse flex justify-center">
                          <div className="h-4 w-4 bg-gray-600 rounded-full mr-1"></div>
                          <div className="h-4 w-4 bg-gray-500 rounded-full mr-1"></div>
                          <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
                        </div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <ul className="py-1">
                          {searchResults.map(post => (
                            <li key={post._id}>
                              <button 
                                className="w-full px-3 py-2 text-left hover:bg-gray-700 flex items-start gap-3"
                                onClick={() => handleResultClick(post._id)}
                              >
                                <div className="w-12 h-12 relative flex-shrink-0 bg-gray-700">
                                  {post.imageUrl && (
                                    <Image 
                                      src={post.imageUrl} 
                                      alt={post.title} 
                                      fill 
                                      className="object-cover"
                                      unoptimized={true}
                                    />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white line-clamp-2">
                                    {highlightSearchTerm(post.title)}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <span className="bg-gray-700 px-1.5 py-0.5 rounded-sm mr-1">
                                      {post.category}
                                    </span>
                                    <span>{formatDate(post.createdAt)}</span>
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-gray-700 p-2">
                          <button 
                            className="w-full text-center text-blue-400 hover:text-blue-300 text-base font-medium py-2"
                            onClick={() => {
                              router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                              setShowResults(false)
                              setShowMobileSearch(false)
                            }}
                          >
                            View all results
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        No results found for &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Mobile navbar */}
        <div className="flex justify-between items-center h-16 md:hidden">
          <button className="p-2" onClick={toggleMenu} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
          
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold">
              <span className="text-white">Pakistan</span>
              <span className="text-blue-400">Info</span>
            </span>
          </Link>
          
          <button className="p-2" onClick={toggleMobileSearch} aria-label="Search">
            <Search size={24} />
          </button>
        </div>
        
        {/* Desktop navbar */}
        <div className="hidden md:flex justify-between items-center py-6">
          <Link href="/" className="text-5xl font-extrabold tracking-tight">
              <span className="text-white">Pakistan</span>
              <span className="text-blue-400">Info</span>
          </Link>
          
          <div className="w-full max-w-md" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full py-2 pl-4 pr-10 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setShowResults(true)
                    }
                  }}
                />
                <button 
                  type="submit"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  <Search size={20} className="text-gray-400" />
                </button>
              </div>

              {showResults && (
                <div className="absolute mt-1 w-full bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-400">
                      <div className="animate-pulse flex justify-center">
                        <div className="h-4 w-4 bg-gray-600 rounded-full mr-1"></div>
                        <div className="h-4 w-4 bg-gray-500 rounded-full mr-1"></div>
                        <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <ul className="py-1">
                        {searchResults.map(post => (
                          <li key={post._id}>
                            <button 
                              className="w-full px-3 py-2 text-left hover:bg-gray-700 flex items-start gap-3"
                              onClick={() => handleResultClick(post._id)}
                            >
                              <div className="w-12 h-12 relative flex-shrink-0 bg-gray-700">
                                {post.imageUrl && (
                                  <Image 
                                    src={post.imageUrl} 
                                    alt={post.title} 
                                    fill 
                                    className="object-cover"
                                    unoptimized={true}
                                  />
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white line-clamp-2">
                                  {highlightSearchTerm(post.title)}
                                </div>
                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                  <span className="bg-gray-700 px-1.5 py-0.5 rounded-sm mr-1">
                                    {post.category}
                                  </span>
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-700 p-2">
                        <button 
                          className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium py-1"
                          onClick={() => {
                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                            setShowResults(false)
                          }}
                        >
                          View all results
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center text-gray-400">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center border-t border-gray-700 py-3">
          <nav className="flex items-center space-x-8">
            <Link href="/" className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-xl font-bold">Home</Link>
            <Link href="/category/business" className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-lg font-bold">Business</Link>
            <Link href="/category/tech" className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-lg font-bold">Tech</Link>
            <Link href="/category/weather" className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-lg font-bold">Weather</Link>
            <Link href="/category/automotive" className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-lg font-bold">Automotive</Link>
            <Link href="/category/pakistan" className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-lg font-bold">Pakistan</Link>
            <Link href="/category/global" className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-lg font-bold">Global</Link>

            <div className="relative">
              <button 
                onClick={toggleLifestyleDropdown}
                className="py-3 px-2 hover:text-blue-400 transition-colors uppercase text-lg font-bold flex items-center"
                aria-expanded={lifestyleDropdownOpen}
              >
                Lifestyle <ChevronDown size={20} className="ml-1" />
              </button>
              
              {lifestyleDropdownOpen && (
                <div className="absolute top-full left-0 bg-gray-800 py-3 w-56 shadow-xl rounded-b-md border border-gray-700">
                  <Link href="/category/lifestyle/health" className="block px-5 py-3 hover:bg-gray-700 text-base font-bold">Health</Link>
                  <Link href="/category/lifestyle/sports" className="block px-5 py-3 hover:bg-gray-700 text-base font-bold">Sports</Link>
                  <Link href="/category/lifestyle/entertainment" className="block px-5 py-3 hover:bg-gray-700 text-base font-bold">Entertainment</Link>
                  <Link href="/category/lifestyle/education" className="block px-5 py-3 hover:bg-gray-700 text-base font-bold">Education</Link>
                  <Link href="/category/lifestyle/islam" className="block px-5 py-3 hover:bg-gray-700 text-base font-bold">Religion</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 h-full w-3/4 max-w-xs text-white p-5 overflow-y-auto border-r border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <Link href="/" className="text-xl font-bold">
                  <span className="text-white">Pakistan</span>
                  <span className="text-blue-400">Info</span>
                </Link>
                <button onClick={toggleMenu} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-1 border-t border-gray-700 pt-4">
                <Link 
                  href="/" 
                  className="py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/category/business" 
                  className="py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Business
                </Link>
                <Link 
                  href="/category/tech" 
                  className="py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tech
                </Link>
                <Link 
                  href="/category/weather" 
                  className="py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Weather
                </Link>
                <Link 
                  href="/category/automotive" 
                  className="py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Automotive
                </Link>
                <Link 
                  href="/category/pakistan" 
                  className="py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pakistan
                </Link>
                <Link 
                  href="/category/global" 
                  className="py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Global
                </Link>
                
                <button 
                  className="flex items-center justify-between w-full py-3 px-2 hover:bg-gray-800 text-lg font-bold border-b border-gray-700"
                  onClick={() => setLifestyleDropdownOpen(!lifestyleDropdownOpen)}
                >
                  Lifestyle
                  <ChevronDown size={20} className={`transform transition-transform ${lifestyleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {lifestyleDropdownOpen && (
                  <div className="pl-4 border-l-2 border-blue-500 ml-2">
                    <Link 
                      href="/category/lifestyle/health" 
                      className="block py-3 hover:bg-gray-800 text-base border-b border-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Health
                    </Link>
                    <Link 
                      href="/category/lifestyle/sports" 
                      className="block py-3 hover:bg-gray-800 text-base border-b border-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sports
                    </Link>
                    <Link 
                      href="/category/lifestyle/entertainment" 
                      className="block py-3 hover:bg-gray-800 text-base border-b border-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Entertainment
                    </Link>
                    <Link 
                      href="/category/lifestyle/education" 
                      className="block py-3 hover:bg-gray-800 text-base border-b border-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Education
                    </Link>
                    <Link 
                      href="/category/lifestyle/islam" 
                      className="block py-3 hover:bg-gray-800 text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Religion
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}