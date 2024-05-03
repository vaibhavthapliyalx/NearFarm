/**
 * @fileoverview This file contains the API routes for reviews.
 */

import { connectDB } from "@/lib/database";
import Review from "@/lib/models/review.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const product_id = request.nextUrl.searchParams.get('productId');
    const user_id = request.nextUrl.searchParams.get('userId');
    const review_id = request.nextUrl.searchParams.get('reviewId');

    let query;
    if (product_id) {
      query = { productId: product_id };
    } else if (user_id) {
      query = { userId: user_id };
    } else if (review_id) {
      query = { _id: review_id };
    } else {
      query = {};
    }

    // Get the reviews using the query specified.
    const reviews = await Review.find(query);
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
      message: "Reviews found",
        data: reviews
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while fetching the reviews',
        error: error
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();

    // Create a new review
    const review = {
      productId: body.productId,
      productName: body.productName,
      userId: body.userId,
      userName: body.userName,
      rating: body.rating,
      review: body.review,
      likes: body.likes
    };

    // Now we can save the review to the database.
    const newReview = await Review.create(review);

    if (!newReview) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Something went wrong while writing the review"
        }
      });
    }

    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Review written successfully",
        data: newReview
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while writing the review',
        error: error
      }
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();
    
    // Find the review by id.
    const review_id = body.id;
    const review = await Review.findById(review_id);
    if (!review) {
      return NextResponse.json({
        status: 404,
        body: {
          success: false,
          message: "Couldn't find the review with the specified id"
        }
      });
    }

    // Update the review
    const updatedReview = await Review.updateOne({
      _id: review_id
    }, {
      $set: {
        rating: body.rating,
        review: body.review,
        edited: true
      }
    }, {
      new: true
    });

    // Return error if the review couldn't be updated
    if (!updatedReview) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Something went wrong while updating the review"
        }
      });
    }
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Review updated successfully",
        data: updatedReview
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while updating the review',
        error: error
      }
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const review_id = request.nextUrl.searchParams.get('reviewId');

    // Delete the review
    const deletedReview = await Review.findByIdAndDelete(review_id);

    if (!deletedReview) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Something went wrong while deleting the review"
        }
      });
    }

    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Review deleted successfully",
        data: deletedReview
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while deleting the review',
        error: error
      }
    });
  }
}
