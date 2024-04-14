/**
 * @fileoverview This file contains the API routes for handling likes on reviews.
 */

import { connectDB } from "@/lib/database";
import Review from "@/lib/models/review.model";
import User from "@/lib/models/user.model";
import { LikeAction } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();
    const action = body.action;

    // Find the review by ID
    const review = await Review.findOne({ _id: body.reviewId });
    const user = await User.findOne({ _id: body.userId });

    if(!review || !user) {
      return NextResponse.json({
        status: 404,
        body: {
          success: false,
          message: "Review or user not found"
        }
      });
    }

    if (action === LikeAction.LIKE) {
      // Check if the user has already liked the review
      if (user.likedReviews.includes(review._id)) {
        return NextResponse.json({
          status: 400,
          body: {
            success: false,
            message: "User has already liked the review"
          }
        });
      }

      // Update the review and user
      review.likes++;
      user.likedReviews.push(review._id);

      await review.save();
      await user.save();

      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Review liked successfully"
        }
      });
    } else if (action === LikeAction.UNLIKE) {
      // Check if the user has already unliked the review
      if (!user.likedReviews.includes(review._id)) {
        return NextResponse.json({
          status: 400,
          body: {
            success: false,
            message: "User has not liked the review yet"
          }
        });
      }

      // Update the review and user
      review.likes = Math.max(0, review.likes - 1); // Ensure the likes count doesn't go below 0
      
      // Using the $pull operator to remove the review ID from the likedReviews array
      await User.updateOne({ _id: body.userId }, { $pull: { likedReviews: review._id } });

      await review.save();
      await user.save();

      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Review unliked successfully"
        }
  });
    } else {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Invalid action"
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while liking the review",
        error: error
      }
    });
  }
}



