"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Lock, Send, Sparkles, Star } from "lucide-react";

interface RatingFormProps {
  pgId: string;
  pgName?: string;
  onSubmitted?: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function RatingForm({ pgId, pgName, onSubmitted, onSuccess, onClose }: RatingFormProps) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [source, setSource] = useState<"lived_here" | "friend_told" | "other">("lived_here");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
        <div className="mb-4 inline-flex w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 items-center justify-center">
          <Lock className="w-6 h-6 text-blue-300" />
        </div>
        <p className="text-slate-300 mb-5 font-medium">You must be logged in to rate this PG.</p>
        <Link
          href="/auth"
          className="inline-flex px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30"
        >
          Login to Rate
        </Link>
      </div>
    );
  }

  const handleAddImageUrl = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    const url = target.value;
    if (url && imageUrls.length < 5) {
      setImageUrls([...imageUrls, url]);
      target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (rating === 0) {
      setError("Please select a rating");
      setLoading(false);
      return;
    }

    if (review.length < 10) {
      setError("Review must be at least 10 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include httpOnly cookies
        body: JSON.stringify({
          pgId,
          rating,
          review,
          source,
          images: imageUrls,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to submit rating");
        return;
      }

      setSuccess("Rating submitted successfully!");

      // Reset form
      setTimeout(() => {
        setRating(0);
        setReview("");
        setSource("lived_here");
        setImageUrls([]);
        onSubmitted?.();
        onSuccess?.();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 rounded-2xl p-6 max-w-2xl backdrop-blur-sm shadow-2xl shadow-slate-900/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent inline-flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            {pgName ? `Rate ${pgName}` : "Rate This PG"}
          </h3>
          <p className="text-slate-400 text-sm mt-1">Share your experience with other students</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/40 text-red-300 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-600/10 border border-green-500/40 text-green-300 text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-3 inline-flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            How would you rate this PG?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className={`w-12 h-12 rounded-lg font-bold transition-all ${
                  rating >= r
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* How do you know? */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            How do you know about this PG?
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as "lived_here" | "friend_told" | "other")}
            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all hover:bg-slate-700/70"
          >
            <option value="lived_here">I lived here</option>
            <option value="friend_told">A friend told me</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience... (min 10 characters)"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none hover:bg-slate-700/70"
          />
          <p className="text-xs text-slate-400 mt-1">
            {review.length}/1000 characters
          </p>
        </div>

        {/* Image URLs */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Add Images (Optional) - Max 5
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              placeholder="Paste image URL..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImageUrl(e as unknown as React.KeyboardEvent<HTMLInputElement>);
                }
              }}
              onBlur={(e) => handleAddImageUrl(e as unknown as React.ChangeEvent<HTMLInputElement>)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm hover:bg-slate-700/70"
            />
          </div>

          {/* Image Preview */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Proof ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                    onError={() => handleRemoveImage(idx)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-600/50 text-slate-100 font-semibold hover:bg-slate-700/50 hover:border-slate-600 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 disabled:shadow-none"
          >
            <span className="inline-flex items-center gap-2">
              {loading ? <Send className="w-4 h-4 animate-pulse" /> : <Star className="w-4 h-4" />}
              {loading ? "Submitting..." : "Submit Rating"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
