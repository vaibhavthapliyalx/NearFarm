/**
 * @fileoverview This file contains the image parser module.
 * 
 * This module contains the image parser functions.
 */
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

/**
 * This function parses an image file into a buffer.
 * 
 * @param imageUrl The image url to parse.
 * @returns The image buffer.
 */
async function parseImage(imageUrl: any): Promise<Buffer | null> {
  try {
    const base64Data = imageUrl.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    return imageBuffer;
  } catch (error) {
    console.error('Error parsing image:', error);
    return null;
  }
}

export { parseImage };