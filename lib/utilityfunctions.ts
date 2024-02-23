import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cryptr from "cryptr"

export function classMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

import { randomBytes } from 'crypto';

/**
 * This function generates a random string of the specified length.
 * It is used to generate a reset password token.
 * This uses the randomBytes function from the crypto module and converts the bytes to hex string.
 * It then slices the string to the specified length.
 * A hex string is used because it is more efficient than a base64 string.
 * 
 * @param length  The length of the random string to be generated.
 * @returns 
 */
export function generateRandomString(length: number): string {
  const bytes = randomBytes(Math.ceil(length / 2));
  const hexString = bytes.toString('hex').slice(0, length);
  return hexString;
}

/**
 * This function encrypts the text using the secret key.
 * It uses the Cryptr library to encrypt the text.
 * 
 * @param text  The text to be encrypted.
 * @returns The encrypted text.
 */
export function encrypt(text: string): string {
  const crypt = new Cryptr(process.env.SECRET_KEY!);
  return crypt.encrypt(text);
}

/**
 * This function decrypts the text using the secret key.
 * It uses the Cryptr library to decrypt the text.
 * 
 * @param text  The text to be decrypted.
 * @returns The decrypted text.
 */
export function decrypt(text: string): string {
  const crypt = new Cryptr(process.env.SECRET_KEY!);
  return crypt.decrypt(text);
}

