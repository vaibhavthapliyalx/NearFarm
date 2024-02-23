import { connectDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import vine, { errors } from '@vinejs/vine'
import { loginValidation} from "@/lib/validations/authValidation";
import bcrypt from "bcryptjs";
import User from "@/lib/models/user.model";


export async function POST(request: NextRequest) {
    try {
        // Connect to MongoDB
        await connectDB();
        const body = await request.json();
        const validator = vine.compile(loginValidation);
       

        const output = await validator.validate(body);

        // Check if user exists.
        // Here we use the select method to include the password field in the query.
        const user = await User.findOne({ email: output.email }).select('+password');

        if (user) {
            const validPassword = bcrypt.compareSync(output.password!, user.password);
            
            if (!validPassword) {
                return NextResponse.json({ 
                    status: 400,
                    body: {
                        success: false,
                        message: "Please check your credentials and try again."
                    }
                });
            }
            return NextResponse.json({ 
                status: 200,  
                body: {
                    success: true,
                    message: "User logged in successfully"
                }
            });
        } else {
            return NextResponse.json({
                status: 400,
                body: {
                    success: false,
                    message: "No account found with this email"
                }
            });
        }
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
                message: 'An error occurred while logging in. Please try again.',
                error: error
            }
        });
    }
}