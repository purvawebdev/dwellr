import mongoose from "mongoose";

/**
 * Validate if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: unknown): boolean {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

/**
 * Validate and return sanitized ID, throws error if invalid
 */
export function validateObjectId(id: unknown, fieldName: string = "ID"): string {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
  return id as string;
}
