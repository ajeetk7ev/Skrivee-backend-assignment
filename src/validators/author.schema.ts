import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  total_fans: z.number().int().min(0, "Fans cannot be negative"),
  total_faves: z.number().int().min(0, "Faves cannot be negative"),
  total_skrivees: z.number().int().min(0, "Skrivees cannot be negative"),
  total_skrivees_read: z.number().int().min(0, "Reads cannot be negative"),
  profile_completeness: z.number().min(0).max(100, "Profile completeness must be between 0 and 100")
});
