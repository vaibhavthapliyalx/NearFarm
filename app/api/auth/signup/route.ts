import { connectDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import vine, { errors } from '@vinejs/vine'
import { signupValidation} from "@/lib/validations/auth.validation";
import bcrypt from "bcryptjs";
import User from "@/lib/models/user.model";


export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();
    const validator = vine.compile(signupValidation);

    const output = await validator.validate(body);

    // Check if user already exists
    const user = await User.findOne({ email: output.email });

    if (user) {
      return NextResponse.json({
        status: 400,
        body: {
            success: false,
            message: "User with this email already exists"
        }
      });
    }

    // Encrypt password with the generated salt.
    const salt = await bcrypt.genSalt(10);
    output.password = bcrypt.hashSync(output.password, salt);

    // Create user
    await User.create(output);

    return NextResponse.json(
      {
        status: 200,
        body: {
          success: true,
          message: "User created successfully"
        }
      }
    );
} catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json({ 
        status: 400, 
        body: {
          success: false,
          message: error.messages,
        }
      });
    } 
    return NextResponse.json({ 
      status: 500, 
      body: {
        success: false,
        message: 'An error occurred while creating the user. Please try again.',
        error: error
      }
    });
  }
}