import mongoose, { Schema, Document } from "mongoose";

export interface IRating extends Document {
  pgId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  rating: number; // 1-5
  review: string;
  source: "lived_here" | "friend_told" | "other"; // How they know about the PG
  images: string[]; // Array of image URLs
  helpful: number; // Count of helpful votes
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PG",
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      minlength: 10,
      maxlength: 1000,
    },
    source: {
      type: String,
      enum: ["lived_here", "friend_told", "other"],
      required: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5; // Max 5 images per rating
        },
        message: "Maximum 5 images allowed per rating",
      },
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Rating = mongoose.models.Rating || mongoose.model<IRating>("Rating", ratingSchema);
