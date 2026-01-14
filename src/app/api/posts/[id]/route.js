import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; 
import Post from '@/models/Post';
import { uploadImage } from '@/lib/cloudinary';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    console.log('GET request for post ID:', id);
    
    // Connect to the database
    await connectDB();
    
    const post = await Post.findById(id);
    console.log('Post found:', post ? 'Yes' : 'No');
    
    if (!post) {
      console.log('Post not found with ID:', id);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    console.log('Returning post data');
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  
  try {
    // Parse form data
    const formData = await request.formData();
    
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const image = formData.get('image');
    
    // Connect to database
    await connectDB();
    
    // Get existing post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData = {
      title: title || existingPost.title,
      content: content || existingPost.content,
      category: category || existingPost.category,
      updatedAt: new Date()
    };
    
    // Upload new image to Cloudinary if provided
    if (image && image instanceof File && image.size > 0) {
      try {
        console.log('Uploading new image to Cloudinary...');
        updateData.imageUrl = await uploadImage(image);
        console.log('New image uploaded to Cloudinary:', updateData.imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image to Cloudinary' },
          { status: 500 }
        );
      }
    }
    
    // Update post in database
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    return NextResponse.json({ 
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ 
      error: 'Failed to update post', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    await connectDB();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Delete post by ID
    const result = await Post.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}