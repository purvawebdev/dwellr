import bcryptjs from "bcryptjs";
import { User } from "./user.model";
import { signToken } from "@/lib/jwt";
import { SignupInput, LoginInput } from "./auth.validation";

/**
 * Hash password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Register a new user
 */
export async function registerUser(data: SignupInput) {
  // Check if user already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create new user
  const user = await User.create({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    role: data.role || "student",
  });

  // Generate token
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Login user with email and password
 */
export async function loginUser(data: LoginInput) {
  // Find user by email
  const user = await User.findOne({ email: data.email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password
  const passwordMatch = await comparePassword(data.password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  return User.findById(id);
}

/**
 * Update user profile
 */
export async function updateUserProfile(id: string, data: Partial<{ name: string; bio: string; profileImage: string }>) {
  return User.findByIdAndUpdate(id, data, { new: true });
}
