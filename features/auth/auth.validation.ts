import { z } from "zod";

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .trim()
  .toLowerCase();

// Password validation: min 12 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character (!@#$%^&*)");

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

// Change password validation
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
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
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
