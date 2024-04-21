/**
 * This file is used to define the routes for the image-processor module.
 * This module is used to process images, such as resizing, compressing and parsing images.
 */

import { parseImage } from "@/lib/parser/image-parser";
import { resizeImage } from "@/lib/preprocessor/image-preprocessor";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";


export async function POST(request: NextRequest) {
  
  const body = await request.json();
  // Get the image url from the request body.
  const imageUrl = body.imageUrl;
  // Parse the image.

  // We will now use our ImageParser module to parse the image and convert it to a buffer.
  const imgBuffer = await parseImage(imageUrl);
  if (!imgBuffer) {
    return NextResponse.json({
      status: 400,
      body: {
        success: false,
        message: "Failed to parse image. Please try again."
      }
    });
  }

  // If the image is parsed successfully, we proceed to apply the preprocessing to the image.
  // Here, we resize the image to a target width and height using the ImagePreprocessor module.
  const processedImageBuffer = await resizeImage(imgBuffer, body.targetWidth, body.targetHeight);

  if (!processedImageBuffer) {
    return NextResponse.json({
      status: 400,
      body: {
        success: false,
        message: "Failed to apply preprocessing to image. Please try again."
      }
    });
  }

  // After the image is processed, we need to compress the image if it is too large.
  // We are doing this because we have a very limited amount of storage space on our blob storage server.
  // We will use the sharp library to compress the image.
  
  // Check the size of the image buffer
  const imageSizeInMB = processedImageBuffer.length / (1024 * 1024);
  if (imageSizeInMB > 4) {
    // If the image size is more than 4 MB, compress the image
    const compressedImageBuffer = await sharp(processedImageBuffer)
      .jpeg({ quality: 80 }) 
      .toBuffer();

    if (!compressedImageBuffer) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Failed to compress image. Please try again."
        }
      });
    }
    // If the image is successfully processed, we return the processed image buffer.
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Image processed successfully. It was compressed",
        data: compressedImageBuffer
      }
    });
  } else {
    // If the image size is already within the limit, return the processed image buffer without compressing it.
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Image processed successfully.",
        data: processedImageBuffer
      }
    });
  }
}
  