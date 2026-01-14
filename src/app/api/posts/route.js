import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { uploadImage } from '@/lib/cloudinary';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = Number(searchParams.get('skip')) || 0;
    const search = searchParams.get('search');
    const exclude = searchParams.get('exclude'); // ID of post to exclude (for related posts)
    
    await connectDB();
    
    // Build query based on parameters
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } }
      ];
    }
    
    if (exclude && mongoose.Types.ObjectId.isValid(exclude)) {
      query._id = { $ne: new mongoose.Types.ObjectId(exclude) };
    }
    
    // Execute query
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Post.countDocuments(query);
    
    return NextResponse.json({ 
      posts,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Error fetching posts', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const image = formData.get('image');
    
    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    let imageUrl = null;
    
    // Upload image to Cloudinary if provided
    if (image && image instanceof File && image.size > 0) {
      try {
        console.log('Uploading image to Cloudinary...');
        imageUrl = await uploadImage(image);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image to Cloudinary' },
          { status: 500 }
        );
      }
    }
    
    // Create new post document
    const post = await Post.create({
      title,
      content,
      category,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(
      { message: 'Post created successfully', post }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}