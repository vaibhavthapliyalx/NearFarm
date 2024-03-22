/**
 * @fileoverview This file contains the validation schema for the onboarding process.
 */
import { UserRole } from "@/shared/constants";
import * as z from "zod";

// Validation schema for onboarding process.
export const onBoardingValidation = z.object({
  image: z.string().url().or(z.literal("")),
  name: z
    .string()
    .min(3, { message: "Full name should be at least 3 characters long" })
    .max(32, { message: "Full name should not be more than 32 characters long" }),
  
  username: z
    .string()
    .min(3, { message: "Username should be at least 3 characters long" })
    .max(32, { message: "Username should not be more than 32 characters long" }),

  bio: z
    .string()
    .min(3, { message: "Bio should be at least 3 characters long" })
    .max(300, { message: "Bio should not be more than 300 characters long" }),
  
  dob: z.date(),
  phone: z
    .string()
    .max(15, { message: "That's not a valid phone number" })
    .optional(),
  address: z
    .string()
    .min(3, { message: "Address should be at least 3 characters long" })
    .max(60, { message: "Address should not be more than 60 characters long" }),
  role: z
    .enum([UserRole.CONSUMER, UserRole.FARMER]),
  docs: z.array(z.string().url().optional().nullable()).optional().nullable(),
});

// Validation schema for password change.
export const passwordChangeValidation = z.object({
  oldPassword: z.string().min(8, { message: "Password should be at least 8 characters long" }),
  newPassword: z.string().min(8, { message: "Password should be at least 8 characters long" })
});