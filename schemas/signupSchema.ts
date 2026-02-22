import { z } from "zod";

export const signupSchema = z.object({
  // Required fields
  email: z.email({ message: "Invalid email address" }),

  // Minimum 8 characters, uppercase, lowercase, number, special character
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "Password does not meet the requirements" }
    ),

  // Signup method selection
  selectedMethod: z.enum(["email", "phone"] as const, {
    message: "Invalid selection method",
  }),

  // 10-digit Indian mobile number
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Invalid phone number" }),
});

export type SignupInput = z.infer<typeof signupSchema>;