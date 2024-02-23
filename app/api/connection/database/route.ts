import { pingDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    pingDB();
    return NextResponse.json({
      status: 200,
      body: {
        success: true, 
        message: "Database connection is operational." 
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while pinging the database.",
        error: error
      }
    }
    );
  }
}