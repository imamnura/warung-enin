import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z.string().optional(),
  images: z.array(z.string()).max(5, "Maksimal 5 gambar"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
