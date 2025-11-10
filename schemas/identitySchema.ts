import { z } from "zod";

export const identitySchema = z.object({
  fullName: z.string().trim().min(1, { message: "Username is required" }),
  email: z.email({ message: "Invalid email address" }),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().optional(),
  company: z.string().trim().optional(),
  dateOfBirth: z.date().optional(),
  notes: z.string().trim().optional(),
});

export type IdentityInput = z.infer<typeof identitySchema>;
