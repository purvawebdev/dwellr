import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { changePassword } from "@/features/auth/auth.service";
import { changePasswordSchema } from "@/features/auth/auth.validation";
import { checkToken } from "@/lib/jwt";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header or cookie
    let token: string | null = null;

    // First try Authorization header
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // Fall back to cookie
    if (!token) {
      token = req.cookies.get("authToken")?.value || null;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid token" },
        { status: 401 }
      );
    }

    const decoded = checkToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validatedData = changePasswordSchema.parse(body);

    // Change password
    const result = await changePassword(decoded.id, validatedData);

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);

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
      error instanceof Error ? error.message : "An error occurred";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 400 }
    );
  }
}
