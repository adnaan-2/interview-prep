import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request, { params }) {
  const { id } = params;

  try {
    await connectDB();

    // Increment view count
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      views: post.views 
    });

  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json({ 
      error: 'Failed to update view count' 
    }, { status: 500 });
  }
}