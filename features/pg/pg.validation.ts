import { z } from "zod";

export const getNearbySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const createPGSchema = z.object({
  name: z.string().min(3, "PG name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  lat: z.number().min(-90).max(90, "Invalid latitude"),
  lng: z.number().min(-180).max(180, "Invalid longitude"),
  minRent: z.number().min(0, "Minimum rent must be positive"),
  maxRent: z.number().min(0, "Maximum rent must be positive"),
  amenities: z.array(z.string()).optional(),
});

export type CreatePGInput = z.infer<typeof createPGSchema>;