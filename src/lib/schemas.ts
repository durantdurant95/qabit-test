import { z } from "zod";

export const newPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),
  body: z.string().trim().min(1, "Body is required"),
});

export type NewPostValues = z.infer<typeof newPostSchema>;
