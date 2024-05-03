/**
 * @fileoverview This file contains the validation schema for the reply routes.
 */
import * as z from "zod";

export const ReplyValidation = z.object({
  reply: z.string().min(3, { message: "Minimum 3 characters." })
});