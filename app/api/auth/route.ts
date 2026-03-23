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

      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
          token: result.token,
          user: result.user,
        },
        { status: 201 }
      );
    } else if (action === "login") {
      // Validate login data
      const validatedData = loginSchema.parse(body);
      const result = await loginUser(validatedData);

      return NextResponse.json(
        {
          success: true,
          message: "Login successful",
          token: result.token,
          user: result.user,
        },
        { status: 200 }
      );
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

    // Handle other errors
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
