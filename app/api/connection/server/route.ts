import { NextResponse } from "next/server";

export async function GET() {
    // Simulating server connection.
    return NextResponse.json({
        status: 200, 
        body: {
            success: true,
            message: "Server connection is operational." 
        }
    });
}

