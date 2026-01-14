import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// In development with Next.js, the model can be compiled with an old schema.
// Remove any existing model so the latest schema (without name/email) is used.
if (mongoose.models.Comment) {
  delete mongoose.models.Comment;
}

export default mongoose.model('Comment', CommentSchema);