import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  author: {
    type: String,
    default: 'Admin',
  },
  views: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
