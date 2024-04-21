/**
 * @fileoverview This file contains the validation schema for the products.
 */
import { ProductCategory } from "@/shared/constants";
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

  salePrice: z.string().min(0, { message: "Product sale price should be greater than 0" }),
  marketPrice: z.string().min(0, { message: "Product market price should be greater than 0" }),
  quantity: z.string().min(0, { message: "Product quantity should be greater than 0" }),
  images: z.array(z.string()).min(1, { message: "Product should have at least one image" }),
  availableFrom: z.date(),
  collectionAddress: z.string().optional(),
  category: z.enum([ProductCategory.ALL, ProductCategory.CUTS_SPROUTS, 
    ProductCategory.EXOTIC_FRUITS_VEGGIES, ProductCategory.FLOWER_BOUQUETS_BUNCHES, 
    ProductCategory.FRESH_VEGETABLES, ProductCategory.ORGANIC_FRUITS_VEGETABLES,
    ProductCategory.FRESH_FRUITS, ProductCategory.HERBS_SEASONINGS, ProductCategory.OTHERS]),   
  notes: z.string().optional(),
});