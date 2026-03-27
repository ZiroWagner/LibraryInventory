import { z } from "zod"

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publishedYear: z.coerce.number().min(1000).max(9999),
  publisher: z.string().optional(),
  stock: z.coerce.number().min(0),
  location: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().min(1, "Category is required"),
})

export type BookFormData = z.infer<typeof bookSchema>
