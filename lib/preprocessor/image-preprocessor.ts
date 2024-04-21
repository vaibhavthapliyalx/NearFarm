/**
 * @fileoverview Image preprocessor module.
 * This module contains the image preprocessor functions.
 * 
 */

// Imports.
import sharp from 'sharp';

/**
 * This function resizes an image.
 * 
 * @param inputBuffer The input image buffer.
 * @param targetWidth The target width of the image.
 * @param targetHeight The target height of the image.
 * @returns The resized image buffer.
 */
async function resizeImage(inputBuffer: Buffer, targetWidth: number, targetHeight: number): Promise<Buffer | null> {
  try {
    const resizedBuffer = await sharp(inputBuffer)
      .resize(targetWidth, targetHeight)
      .toBuffer();
    return resizedBuffer;
  } catch (error) {
    console.error('Error resizing image:', error);
    return null;
  }
}

export { resizeImage };