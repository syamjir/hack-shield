import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  content: z.string().trim().min(1, { message: "Content cannot be empty" }),
  tags: z.array(z.string().trim()).optional(),
});

export type NoteInput = z.infer<typeof noteSchema>;
