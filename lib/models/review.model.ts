/**
 * @fileoverview This file contains the schema for the review.
 */

// Imports.
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  reviewedAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  edited: { type: Boolean, default: false, required: false },
  replies: [{
    user: { type: String },
    username: { type: String },
    userAvatar: { type: String },
    reply: { type: String },
    repliedAt: { type: Date, default: Date.now }
  }],
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);