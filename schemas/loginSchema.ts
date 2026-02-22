import { z } from "zod";

export const loginSchema = z.object({
  // Required fields
  email: z.email({ message: "Invalid email address" }),

  // Minimum 8 character password
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginInput = z.infer<typeof loginSchema>;