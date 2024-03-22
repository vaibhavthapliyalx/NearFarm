/**
 * @fileoverview This file contains the API routes for changing the user's password.
 */

import { connectDB } from "@/lib/database";
import User from "@/lib/models/user.model";
import {  ChangePasswordPayload } from "@/shared/interfaces";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    const payload: ChangePasswordPayload = await request.json();
    // Get the user id from the payload
    const userId = payload.id;
    // Finding the user by id
    const user  = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "User not found. Please try again.",
        },
      });
    }
    // If the user exists, check if the user is using a third-party login
    // If the user is using a third-party login, return an error
    if (!user.password) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "You signed up with a third-party. You can't change your password here.",
        },
      });
    }
    // If the user exists and is not using any third party service for auth, validate the old password
    // If the old password is not valid return an error.
    // If the old password is valid, hash the new password and save it to the user's database.
    const salt = await bcrypt.genSalt(10);
    const isValid = await bcrypt.compare(payload.oldPassword, user.password);

    if (!isValid) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Old password is incorrect. Please try again.",
        },
      });
    }
    const hasedPassword =  bcrypt.hashSync(payload.newPassword, salt);
    
    // Update the user's password
    await User.updateOne({ _id: userId }, { password: hasedPassword });
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Your password has been reset successfully.",
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred. Please try again.",
        error: error,
      },
    });
  }
}