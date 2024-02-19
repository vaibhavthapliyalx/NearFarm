import { connectDB } from "@/lib/database";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
) {

  try {
    // Connect to MongoDB
    await connectDB();
    
    const url = new URL(request.nextUrl);
    const email = url.searchParams.get('email');
    console.log(email);

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ status: 200, message: "User found", data: user });
    } else {
      return NextResponse.json({ status: 400, error: "No user found" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({status:500, error: 'An error occurred while fetching the user' });
  }
}