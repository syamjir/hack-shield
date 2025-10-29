import z from "zod";

export const passwordSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "Password does not meet the requirements" }
    ),
  websiteUri: z
    .union([z.url({ message: "Invalid website URL" }), z.string().length(0)])
    .optional(),
  strength: z.enum(["Weak", "Medium", "Strong"]),
  site: z.string().trim().min(1, { message: "Site name is required" }),
});

export type passwordInput = z.infer<typeof passwordSchema>;
