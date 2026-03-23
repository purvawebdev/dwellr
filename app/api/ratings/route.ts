import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { Rating } from "@/features/pg/rating.model";
import { PG } from "@/features/pg/pg.model";
import { ratingSchema } from "@/features/auth/auth.validation";
import { ZodError } from "zod";

/**
 * POST /api/ratings - Create a new rating
 * Requires authentication
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json();

    // Validate rating data
    const validatedData = ratingSchema.parse(body);

    // Create rating
    const rating = await Rating.create({
      ...validatedData,
      pgId: validatedData.pgId,
      userId: user.id,
    });

    // Update PG's average rating
    const allRatings = await Rating.find({ pgId: validatedData.pgId });
    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    const count = allRatings.length;

    await PG.findByIdAndUpdate(
      validatedData.pgId,
      {
        "ratings.avg": Math.round(avgRating * 10) / 10,
        "ratings.count": count,
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Rating submitted successfully",
        rating: rating.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[RATING_ERROR]", error);

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

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to submit rating",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit rating",
      },
      { status: 400 }
    );
  }
}

/**
 * GET /api/ratings?pgId=xxx - Get all ratings for a PG
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const pgId = req.nextUrl.searchParams.get("pgId");

    if (!pgId) {
      return NextResponse.json(
        { success: false, message: "PG ID is required" },
        { status: 400 }
      );
    }

    const ratings = await Rating.find({ pgId })
      .populate("userId", "name profileImage role")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: ratings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_RATINGS_ERROR]", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch ratings",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch ratings",
      },
      { status: 500 }
    );
  }
}
