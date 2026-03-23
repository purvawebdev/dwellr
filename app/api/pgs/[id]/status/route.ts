import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { PG } from "@/features/pg/pg.model";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid PG ID" },
        { status: 400 }
      );
    }

    // Get user from request (checks both Authorization header and cookies)
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid token" },
        { status: 401 }
      );
    }

    if (user.role !== "superadmin") {
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

    // Validate rejection reason length
    if (rejectionReason && typeof rejectionReason === "string" && rejectionReason.length > 500) {
      return NextResponse.json(
        { success: false, message: "Rejection reason must be less than 500 characters" },
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
    ).populate("ownerId", "name");

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
      { success: false, message: "Failed to update PG status" },
      { status: 500 }
    );
  }
}
