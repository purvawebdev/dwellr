import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getNearbyPGs } from "@/features/pg/pg.service";
import { getNearbySchema } from "@/features/pg/pg.validation";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");

    const parsed = getNearbySchema.safeParse({ lat, lng });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const pgs = await getNearbyPGs(parsed.data.lat, parsed.data.lng);

    return NextResponse.json({
      success: true,
      data: pgs
    });

  } catch (error) {
    console.error("❌ /api/pgs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}