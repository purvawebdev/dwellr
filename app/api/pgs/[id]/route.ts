import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getPGById } from "@/features/pg/pg.service";

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
