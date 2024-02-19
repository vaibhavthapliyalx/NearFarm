import { pingDB } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(request: NextResponse) {
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