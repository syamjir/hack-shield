import z from "zod";

export const passwordSchema = z.object({
  // Required fields
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  strength: z.enum(["Weak", "Medium", "Strong"]),
  site: z.string().trim().min(1, { message: "Site name is required" }),

  // Optional fields
  websiteUri: z
    .union([z.url({ message: "Invalid website URL" }), z.string().length(0)])
    .optional(),
});

export type passwordInput = z.infer<typeof passwordSchema>;