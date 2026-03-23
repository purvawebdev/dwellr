import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { PG } from "@/features/pg/pg.model";

/**
 * GET /api/pgs/all - Get all PGs (for superadmin)
 * Requires authentication and superadmin role
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const user = getUserFromRequest(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Only superadmins can access this" },
        { status: 403 }
      );
    }

    const pgs = await PG.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: pgs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ALL_PGS_ERROR]", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to fetch PGs" },
      { status: 500 }
    );
  }
}
