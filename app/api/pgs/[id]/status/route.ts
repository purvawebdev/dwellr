import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { checkToken } from "@/lib/jwt";
import { PG } from "@/features/pg/pg.model";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Get token from header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const decoded = checkToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Only superadmins can update PG status" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status, rejectionReason } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be 'approved' or 'rejected'",
        },
        { status: 400 }
      );
    }

    if (status === "rejected" && !rejectionReason) {
      return NextResponse.json(
        { success: false, message: "Rejection reason is required" },
        { status: 400 }
      );
    }

    const pg = await PG.findByIdAndUpdate(
      id,
      {
        status,
        ...(status === "rejected" && { rejectionReason }),
      },
      { new: true }
    ).populate("ownerId", "name email");

    if (!pg) {
      return NextResponse.json(
        { success: false, message: "PG not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `PG ${status} successfully`,
        pg,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PG_STATUS_ERROR]", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update PG status" },
      { status: 500 }
    );
  }
}
