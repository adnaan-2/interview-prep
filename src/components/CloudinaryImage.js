// filepath: d:\industry projects\News-Blogs-main\src\components\CloudinaryImage.js
'use client'
import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

export default function CloudinaryImage({ src, alt, fill, className = "", ...props }) {
  const [error, setError] = useState(false);
  
  // Check if it's a Cloudinary URL
  const isCloudinaryUrl = src && src.includes('cloudinary.com');
  
  // Extract public ID if it's a Cloudinary URL
  const getPublicId = (url) => {
    try {
      // Extract the public ID from Cloudinary URL
      const parts = url.split('/');
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex === -1) return null;
      
      // Get everything after 'upload' excluding the file extension
      const publicIdWithVersion = parts.slice(uploadIndex + 2).join('/');
      return publicIdWithVersion.split('.')[0]; // Remove file extension
    } catch (e) {
      console.error('Error parsing Cloudinary URL:', e);
      return null;
    }
  };
  
  if (error || !src || !isCloudinaryUrl) {
    // Fallback placeholder
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ width: '100%', height: '100%' }}
      >
        <span>No image available</span>
      </div>
    );
  }
  
  const publicId = getPublicId(src);
  if (!publicId) {
    // Handle invalid Cloudinary URL
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ width: '100%', height: '100%' }}
      >
        <span>Invalid image</span>
      </div>
    );
  }

  // For fill mode (takes parent container dimensions)
  if (fill) {
    return (
      <div className="relative w-full h-full">
        <CldImage
          src={publicId}
          alt={alt || "Image"}
          fill={true}
          className={className}
          onError={() => setError(true)}
          {...props}
          width={undefined}
          height={undefined}
        />
      </div>
    );
  }
  
  // For explicit dimensions mode
  // Default dimensions if not specified
  const width = props.width || 800;
  const height = props.height || 600;
  
  return (
    <CldImage
      src={publicId}
      width={width}
      height={height}
      alt={alt || "Image"}
      className={className}
      onError={() => setError(true)}
      {...props}
      fill={undefined}
    />
  );
}