/**
 * @fileoverview This file contains the validation schema for the auth routes.
 * This file uses the VineJS library for validation.
 * 
 * Please note that in this project we are using VineJS library for backend validation.
 * And We are using Zod library for frontend validation.
 * As VineJS is not compatible with the frontend, we are using Zod for frontend validation.
 */

// Importing VineJS library for validation.
import vine from '@vinejs/vine'

// Validation schema for signup route.
export const signupValidation = vine.object({
  name: vine.string().trim().minLength(2).maxLength(32),
  email: vine.string().email(),
  password: vine.string().minLength(8).maxLength(20),
  joinDate: vine.string()
})

// Validation schema for login route.
export const loginValidation = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(8).maxLength(20)
})
