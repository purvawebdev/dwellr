import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getPGById } from "@/features/pg/pg.service";
import { getUserFromRequest } from "@/lib/auth";
import { PG } from "@/features/pg/pg.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid PG ID" },
        { status: 400 }
      );
    }

    const pg = await getPGById(id);

    if (!pg) {
      return NextResponse.json(
        { error: "PG not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pg,
    });
  } catch (error) {
    console.error("❌ /api/pgs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid PG ID" },
        { status: 400 }
      );
    }

    const user = getUserFromRequest(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid token" },
        { status: 401 }
      );
    }

    const pg = await PG.findById(id).select("ownerId");

    if (!pg) {
      return NextResponse.json(
        { success: false, message: "PG not found" },
        { status: 404 }
      );
    }

    const isOwner = String(pg.ownerId) === user.id;
    const isSuperadmin = user.role === "superadmin";

    if (!isOwner && !isSuperadmin) {
      return NextResponse.json(
        { success: false, message: "You are not allowed to delete this PG" },
        { status: 403 }
      );
    }

    await PG.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "PG deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_PG_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete PG" },
      { status: 500 }
    );
  }
}
