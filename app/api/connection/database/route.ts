import { pingDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    pingDB();
    return NextResponse.json({status: 200, message: "Database connection is functional"},
        {status: 200}
    );
  } catch (error) {
    return NextResponse.json({status: 400, message: "Database connection failed"},
        {status: 200}
    );
  }
}