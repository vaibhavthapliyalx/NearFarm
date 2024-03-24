/**
 * @fileoverview This file contains the API routes for the user.
 */

import { connectDB } from "@/lib/database";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET( request: NextRequest ) {
  try {
    // Connect to MongoDB
    await connectDB();

    const id = request.nextUrl.searchParams.get('id');
    const email = request.nextUrl.searchParams.get('email');

    let query = {};

    if(id) {
      query = { ...query, _id: id };
    }
    if(email) {
      query = { ...query, email: email };
    }
    
    const user = await User.findOne(query);
    if (user) {
      return NextResponse.json({
        status: 200, 
        body : {
          success: true,
          message: "User found", 
          data: user
        }
      });
    } else {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "No user found" 
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500, 
      body: {
        success: false,
        message: 'An error occurred while fetching the user',
        error: error
      } 
    });
  }
}

export async function PUT(request: NextRequest) {
  // Connect to MongoDB
  await connectDB();
  const body = await request.json();

  try {

    // First, check if username is already taken.
    const isUsernameTaken = await User.findOne({
      username: body.username,
      _id: { $ne: body.id } // Exclude the current user's ID
    });

    if (isUsernameTaken) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Username already taken",
        },
      });
    }

    const user = await User.findOneAndUpdate({
      _id: body.id
    },
    {
      name: body.name,
      username: body.username,
      bio: body.bio,
      age: body.age,
      role: body.role,
      image: body.image,
      joinDate: body.joinDate,
      documents: body.documents,
      contactDetails: body.contactDetails,
      isOnBoarded: true,
    },
    {
      upsert: false,
      new: true
    });

    if (user) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "User updated successfully",
        },
      });
    } else {
      return NextResponse.json({
        status: 404,
        body: {
          success: false,
          message: "User not found",
        },
      });
    }
    
  } catch (error: any) {
    console.log(error);
    if (error.code = "ERR_OUT_OF_RANGE") {
      return NextResponse.json({
        status: 500,
        body: {
          success: false,
          message: "Please compress the image and try again.",
          error: error
        },
      });
    }
    return NextResponse.json({
      status: 400,
      body: {
        success: false,
        message: "An error occurred while updating the user",
        error: error
      },
    });
  }
}

export async function DELETE(request: NextRequest) {
  // Connect to MongoDB
  await connectDB();
  const id = request.nextUrl.searchParams.get('id');

  try {
    const user = await User.findOneAndDelete({
      _id: id
    });

    if (user) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "User deleted successfully",
        },
      });
    } else {
      return NextResponse.json({
        status: 404,
        body: {
          success: false,
          message: "User not found",
        },
      });
    }
    
  } catch (error: any) {
    return NextResponse.json({
      status: 400,
      body: {
        success: false,
        message: "An error occurred while deleting the user",
        error: error
      },
    });
  }
}
