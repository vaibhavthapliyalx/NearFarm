/**
 * @fileoverview This file contains the API routes for handling replies on reviews.
 */

import { connectDB } from "@/lib/database";
import Review from "@/lib/models/review.model";
import User from "@/lib/models/user.model";
import { LikeAction } from "@/shared/constants";
import { Reply } from "@/shared/interfaces";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();
    
    // Find User by ID
    const user = await User.findOne({ _id: body.userId });
    const reply = body.reply;

    if(!user) {
      return NextResponse.json({
        status: 404,
        body: {
          success: false,
          message: "User not found"
        }
      });
    }

    const replyPayload: Reply = {
      user: user.name,
      username: user.username,
      userAvatar: user.image,
      reply: reply,
    };

    // Update the review
    const updatedReview = await Review.findOneAndUpdate(
      { _id: body.reviewId },
      { $push: { replies: replyPayload } },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Failed to add reply"
        }
      });
    }
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Reply added successfully"
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while adding the reply",
        error: error
      }
    });
  }
}