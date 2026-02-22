import { z } from "zod";

// Reusable required string validator
const requiredString = z
  .string()
  .trim()
  .min(1, { message: "Field is required." });

export const cardSchema = z.object({
  // Required fields
  cardHolder: requiredString.min(3, {
    message: "Card holder name must be at least 3 characters.",
  }),

  bank: requiredString,

  // 12–19 digit card number (stored as string)
  cardNumber: requiredString.regex(/^\d{12,19}$/, {
    message: "Card number must be 12 to 19 digits.",
  }),

  // Expiry month (1–12)
  expiryMonth: z.coerce
    .number()
    .min(1, { message: "Month must be between 1 and 12." })
    .max(12),

  // Expiry year (cannot be in the past)
  expiryYear: z.coerce
    .number()
    .int()
    .min(new Date().getFullYear() - 1, {
      message: "Expiry year cannot be in the past.",
    }),

  // 3 or 4 digit CVV
  cvv: requiredString.regex(/^\d{3,4}$/, {
    message: "CVV must be 3 or 4 digits.",
  }),

  // Optional fields
  brand: z.string().trim().optional(),
});

export type CardInput = z.infer<typeof cardSchema>;