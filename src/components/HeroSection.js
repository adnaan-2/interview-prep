import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Stay Informed with
              <span className="text-blue-600 block">Latest News</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover breaking news, expert insights, and trending stories from around the world. 
              Your trusted source for quality journalism and in-depth analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Stories
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&crop=center"
                alt="News and journalism"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-600 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gray-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}