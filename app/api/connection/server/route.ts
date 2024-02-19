import { NextResponse } from "next/server";

export async function GET() {
    // Simulating server connection.
    return NextResponse.json({status: 200, message: "Server connection is functional"},
        {status: 200}
    );
}

