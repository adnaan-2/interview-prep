import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

export async function GET() {
  try {
    await connectDB();

    // Get all posts with their stats
    const posts = await Post.find({})
      .select('title category views commentsCount createdAt')
      .sort({ createdAt: -1 });

    // Get total stats
    const totalPosts = await Post.countDocuments();
    const totalViews = await Post.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    const totalComments = await Comment.countDocuments();

    // Get category-wise stats
    const categoryStats = await Post.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalComments: { $sum: '$commentsCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get most viewed posts
    const mostViewedPosts = await Post.find({})
      .select('title views commentsCount')
      .sort({ views: -1 })
      .limit(10);

    return NextResponse.json({
      posts,
      totalStats: {
        totalPosts,
        totalViews: totalViews[0]?.total || 0,
        totalComments,
      },
      categoryStats,
      mostViewedPosts
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stats' 
    }, { status: 500 });
  }
}