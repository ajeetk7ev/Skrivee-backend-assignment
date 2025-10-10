import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  total_fans: z.number().int().min(0, "Fans cannot be negative"),
  total_faves: z.number().int().min(0, "Faves cannot be negative"),
  total_skrivees: z.number().int().min(0, "Skrivees cannot be negative"),
  total_skrivees_read: z.number().int().min(0, "Reads cannot be negative"),
  profile_completeness: z.number().min(0).max(100, "Profile completeness must be between 0 and 100")
});

export const paginationSchema = z.object({
  page: z.string().optional().transform((val) => {
    const page = parseInt(val || "1", 10);
    return isNaN(page) ? 1 : Math.max(1, page);
  }),
  limit: z.string().optional().transform((val) => {
    const limit = parseInt(val || "10", 10);
    return isNaN(limit) ? 10 : Math.min(Math.max(1, limit), 100); // Max 100 items per page
  })
});