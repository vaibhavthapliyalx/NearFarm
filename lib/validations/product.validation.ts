/**
 * @fileoverview This file contains the validation schema for the products.
 */
import * as z from "zod";

// Validation schema for products.
export const productValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Product name should be at least 3 characters long" })
    .max(32, { message: "Product name should not be more than 32 characters long" }),
  description: z
    .string()
    .min(3, { message: "Product description should be at least 3 characters long" })
    .max(300, { message: "Product description should not be more than 300 characters long" }),

  salePrice: z.number().min(0, { message: "Product sale price should be greater than 0" }),
  marketPrice: z.number().min(0, { message: "Product market price should be greater than 0" }),
  quantity: z.number().min(0, { message: "Product quantity should be greater than 0" }),
  image: z.string().url().optional(),
  sellerId: z.string(),
  availableFrom: z.date(),
  listedAt: z.date(),
  collectionAddress: z.string().optional(),
  category: z.string(),
  notes: z.string().optional(),
});