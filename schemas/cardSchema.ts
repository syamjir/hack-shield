import { z } from "zod";

const requiredString = z
  .string()
  .trim()
  .min(1, { message: "Field is required." });

export const cardSchema = z.object({
  // --- Required Fields ---

  // Maps to cardHolder (used from your Mongoose schema)
  cardHolder: requiredString.min(3, {
    message: "Card holder name must be at least 3 characters.",
  }),

  bank: requiredString,

  // Card number is a string of 12-19 digits (stored as string for encryption)
  cardNumber: requiredString.regex(/^\d{12,19}$/, {
    message: "Card number must be 12 to 19 digits.",
  }),

  // Expiry Month (validated as a number between 1 and 12)
  expiryMonth: z.coerce
    .number()
    .min(1, { message: "Month must be between 1 and 12." })
    .max(12),

  // Expiry Year (validated as a number)
  expiryYear: z.coerce
    .number()
    .int()
    .min(new Date().getFullYear() - 1, {
      message: "Expiry year cannot be in the past.",
    }),

  // CVV/CVC (3 or 4 digits)
  cvv: requiredString.regex(/^\d{3,4}$/, {
    message: "CVV must be 3 or 4 digits.",
  }),

  // --- Optional Fields ---

  brand: z.string().trim().optional(), // Visa, MasterCard, etc.
});

export type CardInput = z.infer<typeof cardSchema>;
