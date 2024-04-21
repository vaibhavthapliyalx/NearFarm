/**
 * @fileoverview This file contains the API route for the forgot password feature.
 */
import User from "@/lib/models/user.model";
import { encrypt, generateRandomString } from "@/lib/utilityfunctions";
import { ForgotPasswordPayload } from "@/shared/interfaces";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import ForgotPasswordEmail from "@/components/emails/forgot-password.email";
import { sendEmail } from "@/lib/nodemailer/mail";
import { connectDB } from "@/lib/database";

export async function POST(request: NextRequest) {
  // Connect to the database
  await connectDB();
  const payload: ForgotPasswordPayload = await request.json();
  // Check if the email exists in the database
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    return NextResponse.json({
      status: 400,
      body: {
          success: false,
          message: "No user found with this email",
      },
    });
  }
  // If the user exists, generate a reset password token and save it to the database.

  // This token is generated using the generateRandomString function from lib/utilityfunctions.ts
  // which uses randomBytes from the crypto module to generate a random string of the specified length.
  const resetPasswordToken = generateRandomString(32);

  // Save the reset password token to the user's database
  await User.updateOne({ email: payload.email }, { resetPasswordToken: resetPasswordToken });
  const encryptedEmail = encrypt(user.email);

  // Send the email to the user with the reset password link.
  const resetPasswordLink = `${process.env.APP_URI}/reset-password/${encryptedEmail}?signature=${resetPasswordToken}`;

  // Send the email to the user
  try {
    const html = render(ForgotPasswordEmail({
      params: {
        email: user.email,
        resetLink: resetPasswordLink,
        name: user.name,
      }
    }));

    // Sending email using nodemailer to the user.
    await sendEmail(payload.email, "Reset your password", html);

    return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Email sent successfully",
        },
    });
  } catch(error) {
    return NextResponse.json({
        status: 500,
        body: {
          success: false,
          message: "Something went wrong. Please try again later.",
          error: error,
        },
    });
  }
}