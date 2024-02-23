// This API reads the package.json file and returns the app version.

import { NextResponse } from "next/server";
import PackageJson from "@/package.json";

// Fetch the app version from the package.json file.
const version = PackageJson.version;

export async function GET() {

  if (!version) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while fetching the app version.",
      },
    });
  } else {
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "App version fetched successfully.",
        data: {
          version: version,
        },
      },
    });
  }
}