'use client'

import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'

export default function JoinUsButtons() {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-gray-700">Join us:</span>
      
      <a 
        href="https://www.facebook.com/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Facebook"
      >
        <FaFacebookF size={30} />
      </a>
      
      <a 
        href="https://www.instagram.com/yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
        aria-label="Instagram"
      >
        <FaInstagram size={30} />
      </a>
      
      <a 
        href="https://www.tiktok.com/@yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
        aria-label="TikTok"
      >
        <FaTiktok size={30} />
      </a>
      
      <a 
        href="https://twitter.com/yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-sky-500 hover:bg-sky-50 rounded-full transition-colors"
        aria-label="X (Twitter)"
      >
        <FaTwitter size={30} />
      </a>
      
      
    </div>
  )
}