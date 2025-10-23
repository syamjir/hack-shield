import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "Password does not meet the requirements" }
    ),
  selectedMethod: z.enum(["email", "phone"] as const, {
    message: "Invalid selection method",
  }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Invalid phone number" }),
});

export type SignupInput = z.infer<typeof signupScheme>;
