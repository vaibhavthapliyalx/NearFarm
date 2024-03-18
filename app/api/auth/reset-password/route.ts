/**
 * @fileoverview This file contains the API route for resetting a user's password.
 */
import { connectDB } from "@/lib/database";
import User from "@/lib/models/user.model";
import {  decrypt } from "@/lib/utilityfunctions";
import {  ResetPasswordPayload } from "@/shared/interfaces";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    const payload: ResetPasswordPayload = await request.json();
    // Decrypting the email.
    const email = decrypt(payload.email);
    const user  = await User.findOne({ email: email, resetPasswordToken: payload.signature });
    if (!user) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "This link is invalid or has expired. Please send another request to reset your password.",
        },
      });
    }
    // If the user exists, check the
    const salt = await bcrypt.genSalt(10);
    user.password =  bcrypt.hashSync(payload.password, salt);
    user.resetPasswordToken = null;

    // Update the user's password and reset the resetPasswordToken.
    await user.save();
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Your password has been reset successfully.",
      },
    });  
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while resetting your password.",
        error: error
      },
    });
  }
}