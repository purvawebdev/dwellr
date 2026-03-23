import { z } from "zod";

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .trim()
  .toLowerCase();

// Password validation: min 6 chars, at least 1 uppercase, 1 number
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Name validation
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .trim();

// Role validation
export const roleSchema = z.enum(["student", "pg_owner", "superadmin"]);

// Signup validation
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: nameSchema,
  role: roleSchema.default("student"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Rating validation
export const ratingSchema = z.object({
  pgId: z.string().min(1, "PG ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  review: z.string().min(10, "Review must be at least 10 characters").max(1000),
  source: z.enum(["lived_here", "friend_told", "other"]),
  images: z.array(z.string().url()).max(5, "Maximum 5 images allowed").default([]),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
