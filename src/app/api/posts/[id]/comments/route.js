import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';

// GET comments for a post
export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectDB();

    const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });

    return NextResponse.json({ comments });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comments' 
    }, { status: 500 });
  }
}

// POST new comment
export async function POST(request, { params }) {
  const { id } = params;

  try {
    const { name, email, comment } = await request.json();

    if (!name || !email || !comment) {
      return NextResponse.json({ 
        error: 'Name, email, and comment are required' 
      }, { status: 400 });
    }

    await connectDB();

    // Create new comment
    const newComment = await Comment.create({
      postId: id,
      name,
      email,
      comment,
    });

    // Increment comment count in post
    await Post.findByIdAndUpdate(
      id,
      { $inc: { commentsCount: 1 } }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Comment added successfully!',
      comment: newComment
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Failed to create comment' 
    }, { status: 500 });
  }
}