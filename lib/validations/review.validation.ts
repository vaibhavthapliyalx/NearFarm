/**
 * @fileoverview This file contains the validation for the add review form.
 */

// Imports.
import * as z from "zod";

// Validation schema for the review form.
export const reviewValidation = z.object({
  id: z.string().optional(),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  review: z.string().max(1500, "Review cannot exceed 1500 characters long").optional(),
});
