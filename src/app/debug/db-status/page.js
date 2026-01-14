'use client';

import { useState, useEffect } from 'react';

export default function DbStatusPage() {
  const [status, setStatus] = useState('Checking database connection...');
  const [posts, setPosts] = useState([]);
  const [dbInfo, setDbInfo] = useState(null);
  
  useEffect(() => {
    async function checkDb() {
      try {
        // Check DB connection
        const connResponse = await fetch('/api/debug/connection');
        const connData = await connResponse.json();
        
        if (connResponse.ok) {
          setStatus(`Database connected: ${connData.message}`);
          setDbInfo(connData.info);
          
          // Then fetch posts
          const postsResponse = await fetch('/api/posts');
          const postsData = await postsResponse.json();
          
          if (postsResponse.ok) {
            setPosts(postsData.posts || []);
          } else {
            throw new Error(`Failed to fetch posts: ${postsData.message}`);
          }
        } else {
          setStatus(`Database connection failed: ${connData.message}`);
        }
      } catch (error) {
        console.error('Error checking database:', error);
        setStatus(`Error: ${error.message}`);
      }
    }
    
    checkDb();
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Status</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <p className={status.includes('Error') ? 'text-red-600' : 'text-green-600'}>
          {status}
        </p>
        
        {dbInfo && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Database Info:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(dbInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Posts ({posts.length})</h2>
        
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="border-b pb-4">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  Category: {post.category} | Created: {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found in the database.</p>
        )}
      </div>
    </div>
  );
}