"use server";

import { PG } from "@/features/pg/pg.model";
import { createPGSchema } from "@/features/pg/pg.validation";
import { getUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Support both Bearer token header and httpOnly auth cookie
    const user = getUserFromRequest(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid token" },
        { status: 401 }
      );
    }

    if (user.role !== "pg_owner") {
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
      ownerId: user.id,
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
