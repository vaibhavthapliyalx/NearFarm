/**
 * @fileoverview This file contains the validation schema for the filters applied to the products list.
 */
import * as z from "zod";
import { ProductCategory, SortByFilter } from "@/shared/constants";

// Validation schema for filters.
export const filterValidation = z.object({
  category: z.array(z.enum([...Object.values(ProductCategory)] as [string, ...string[]])),
  minPrice: z.number(),
  maxPrice: z.number(),
  sortBy:z.enum([SortByFilter.PRICE_LOW_TO_HIGH, SortByFilter.PRICE_HIGH_TO_LOW, SortByFilter.NONE,
    SortByFilter.NEWEST, SortByFilter.OLDEST, SortByFilter.RATING_LOW_TO_HIGH, SortByFilter.RATING_HIGH_TO_LOW])
});