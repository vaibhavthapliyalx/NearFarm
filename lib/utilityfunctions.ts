/**
 * @fileoverview This file contains utility functions that are used throughout the application.
 */

// Importing the required modules.
import { type ClassValue, clsx } from "clsx";
import { randomBytes } from 'crypto';
import { twMerge } from "tailwind-merge";
import Cryptr from "cryptr";

/**
 * This function merges the classes using the clsx and tailwind-merge libraries.
 * It uses the clsx library to merge the classes and the tailwind-merge library to merge the tailwind classes.
 * 
 * @param inputs  The classes to be merged.
 * @returns The merged classes.
 */
export function classMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * This function checks if the image data is a base64 image.
 * It uses a regular expression to check if the image data is a base64 image.
 * 
 * @param imageData  The image data to be checked.
 * @returns A boolean indicating if the image data is a base64 image.
 */
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}


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


/**
 * This function calculates user age from the date of birth.
 * It uses the Date object to calculate the age.
 * 
 * @param dob  The date of birth of the user.
 */
export function calculateAge(dob: string): number {
  const dateOfBirth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const month = today.getMonth() - dateOfBirth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}

/**
 * This function formats the date to the specified format.
 * It uses the Date object to format the date.
 * 
 * @param date  The date to be formatted.
 * @returns The formatted date.
 */
export function getYearFromDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  return year.toString();
}

/**
 * This function checks if the object is empty.
 * 
 * It checks if the object is not null and if the object has no keys.
 * If the object is empty, it returns true, else it returns false.
 * 
 * @param object  The object to be checked.
 * @returns  A boolean indicating if the object is empty.
 * 
 * @source https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
 */
export function isObjectEmpty(object: any): boolean {
  return (
    object &&
    Object.keys(object).length === 0 &&
    object.constructor === Object
  );
};

/**
 * This function returns an array of stars based on the rating.
 * 
 * @param rating  Rating of the place
 * @returns  Array of stars
 */
export function getStars(rating: number) {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(1);
    } else if (i - rating < 1) {
      stars.push(0.5);
    } else {
      stars.push(0);
    }
  }
  return stars;
}