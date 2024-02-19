import { connectDB } from "@/lib/database";
import User from "@/lib/models/user.model";
import {  decrypt } from "@/lib/utilityfunctions";
import {  ResetPasswordPayload } from "@/shared/interfaces";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  // Connect to the database
  await connectDB();
  const payload: ResetPasswordPayload = await request.json();

  // Decrypting the email.
  const email = decrypt(payload.email);
  console.log("The email is: ", email);
  console.log("The signature is: ", payload.signature);

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

  await user.save();

  return NextResponse.json({
    status: 200,
    body: {
      success: true,
      message: "Your password has been reset successfully.",
    },
  });


  
}