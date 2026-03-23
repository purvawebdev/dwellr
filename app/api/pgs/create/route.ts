"use server";

import { PG } from "@/features/pg/pg.model";
import { createPGSchema } from "@/features/pg/pg.validation";
import { checkToken, TokenPayload } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get token from header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    let decoded: TokenPayload | null = null;

    try {
      decoded = checkToken(token);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!decoded || decoded.role !== "pg_owner") {
      return NextResponse.json(
        { success: false, message: "Only PG owners can create listings" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate input
    const validation = createPGSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, address, lat, lng, minRent, maxRent, amenities } =
      validation.data;

    // Create PG
    const pg = new PG({
      name,
      address,
      ownerId: decoded.id,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      rent: {
        min: minRent,
        max: maxRent,
      },
      amenities: amenities || [],
    });

    await pg.save();

    return NextResponse.json(
      {
        success: true,
        message: "PG created successfully. It will be visible after approval.",
        pg: {
          _id: pg._id,
          name: pg.name,
          status: pg.status,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Create PG error:", err);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
