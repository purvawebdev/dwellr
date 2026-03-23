import mongoose from "mongoose";

const pgSchema = new mongoose.Schema({
  name: { type: String, required: true },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  rejectionReason: String,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  address: String,

  rent: {
    min: Number,
    max: Number
  },

  amenities: [String],

  ratings: {
    avg: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }

}, { timestamps: true });

pgSchema.index({ location: "2dsphere" });
pgSchema.index({ ownerId: 1 });

export const PG = mongoose.models.PG || mongoose.model("PG", pgSchema);