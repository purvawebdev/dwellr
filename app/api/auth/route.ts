import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { registerUser, loginUser } from "@/features/auth/auth.service";
import { signupSchema, loginSchema } from "@/features/auth/auth.validation";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { action } = body;

    if (action === "signup") {
      // Validate signup data
      const validatedData = signupSchema.parse(body);
      const result = await registerUser(validatedData);

      // Create response with user data
      const response = NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
          user: result.user,
        },
        { status: 201 }
      );

      // Set httpOnly cookie with token (secure flag enabled in production)
      response.cookies.set({
        name: "authToken",
        value: result.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: "/",
      });

      return response;
    } else if (action === "login") {
      // Validate login data
      const validatedData = loginSchema.parse(body);
      const result = await loginUser(validatedData);

      // Create response with user data
      const response = NextResponse.json(
        {
          success: true,
          message: "Login successful",
          user: result.user,
        },
        { status: 200 }
      );

      // Set httpOnly cookie with token (secure flag enabled in production)
      response.cookies.set({
        name: "authToken",
        value: result.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours in seconds (should be shorter, but for now)
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("[AUTH_ERROR]", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors - return generic message for security
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
