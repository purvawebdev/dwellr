"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { usePG } from "@/hooks/usePG";
import { useAuth } from "@/hooks/useAuth";
import RatingForm from "@/components/RatingForm";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-700 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 animate-skeleton-shimmer" />
  ),
});

export default function PGDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: pg, isLoading, error } = usePG(id);
  const { isAuthenticated } = useAuth();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratings, setRatings] = useState<Array<{
    _id: string;
    pgId: string;
    userId: {
      _id: string;
      name: string;
      profileImage?: string;
      role: string;
    };
    rating: number;
    review: string;
    source: "lived_here" | "friend_told" | "other";
    images: string[];
    helpful: number;
    createdAt: string;
  }>>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [ratingRefresh, setRatingRefresh] = useState(0);

  const fetchRatings = useCallback(async () => {
    setLoadingRatings(true);
    try {
      const response = await axios.get(`/api/ratings?pgId=${id}`);
      if (response.data.success) {
        setRatings(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoadingRatings(false);
    }
  }, [id]);

  // Fetch ratings when component mounts or when rating is submitted
  useEffect(() => {
    if (id) {
      fetchRatings();
    }
  }, [id, fetchRatings, ratingRefresh]);

  const handleRatingSubmitted = () => {
    setShowRatingForm(false);
    setRatingRefresh(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex items-center justify-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
          <span>Loading PG details...</span>
        </div>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">PG not found</h2>
          <p className="text-slate-400 mb-6">
            This PG listing may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const lat = pg.location.coordinates[1];
  const lng = pg.location.coordinates[0];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/explore" className="hover:text-slate-200 transition-colors">
            Explore
          </Link>
          <span>/</span>
          <span className="text-slate-100 font-medium truncate">{pg.name}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header with Name and Rating */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">🏠 {pg.name}</h1>
                {pg.ratings && pg.ratings.count > 0 && (
                  <div className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold">
                    <span>⭐</span>
                    <div>
                      <div className="text-lg">{pg.ratings.avg.toFixed(1)}</div>
                      <div className="text-xs text-amber-200/70">
                        ({pg.ratings.count} review{pg.ratings.count > 1 ? "s" : ""})
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Address */}
              {pg.address && (
                <p className="flex items-start gap-2 text-lg text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-1 text-indigo-400">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {pg.address}
                </p>
              )}
            </div>

            {/* Rent Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/30">
              <div className="text-sm font-medium text-emerald-400 mb-2">Monthly Rent</div>
              <div className="text-3xl font-bold text-emerald-300">
                {pg.rent && (pg.rent.min || pg.rent.max) ? (
                  <>
                    {pg.rent.min && pg.rent.max
                      ? `₹${pg.rent.min.toLocaleString()} – ₹${pg.rent.max.toLocaleString()}`
                      : pg.rent.min
                        ? `From ₹${pg.rent.min.toLocaleString()}`
                        : `Up to ₹${pg.rent.max.toLocaleString()}`}
                  </>
                ) : (
                  "Contact for pricing"
                )}
              </div>
              <div className="text-sm text-emerald-400/70 mt-1">/month</div>
            </div>

            {/* Amenities */}
            {pg.amenities && pg.amenities.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {pg.amenities.map((amenity: string) => (
                    <div
                      key={amenity}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <span className="text-lg">{getAmenityIcon(amenity)}</span>
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Form Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">
                  Rate ({ratings.length} {ratings.length === 1 ? "review" : "reviews"})
                </h3>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowRatingForm(!showRatingForm)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-500 hover:to-orange-500 transition-all text-sm"
                  >
                    {showRatingForm ? "Close" : "Add Rating"}
                  </button>
                )}
              </div>

              {showRatingForm && isAuthenticated && (
                <div className="mb-8 p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                  <RatingForm pgId={id} onSubmitted={handleRatingSubmitted} />
                </div>
              )}

              {!isAuthenticated && (
                <div className="mb-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <p className="text-blue-300 mb-4">
                    <Link href="/auth" className="font-semibold hover:text-blue-200 underline">
                      Login
                    </Link>
                    {" "}to add a rating for this PG
                  </p>
                </div>
              )}
            </div>

            {/* Ratings Display */}
            {loadingRatings ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center justify-center gap-3 text-slate-400">
                  <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
                  <span>Loading reviews...</span>
                </div>
              </div>
            ) : ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating._id} className="p-5 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {rating.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-semibold text-slate-100">{rating.userId?.name || "Anonymous"}</p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium">
                              <span className="flex items-center gap-0.5">
                                {"⭐".repeat(rating.rating)}
                              </span>
                            </span>
                            <span className="text-xs text-slate-400 capitalize bg-slate-700/50 rounded-full px-2 py-0.5">
                              {rating.source === "lived_here" ? "Lived here" : rating.source === "friend_told" ? "Friend told" : "Other"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {new Date(rating.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4 leading-relaxed">{rating.review}</p>

                    {/* Rating Images */}
                    {rating.images && rating.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        {rating.images.map((img: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden border border-slate-600 hover:border-slate-500 transition-colors bg-slate-900/50"
                          >
                            <img
                              src={img}
                              alt={`Rating image ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {rating.helpful !== undefined && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        👍 <span>{rating.helpful} found this helpful</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg bg-slate-800/30 border border-slate-700 text-center">
                <p className="text-slate-400 mb-4">No reviews yet. Be the first to review this PG!</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowRatingForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-500 hover:to-orange-500 transition-all"
                  >
                    Write First Review
                  </button>
                )}
              </div>
            )}

            {/* Coordinates */}
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                GPS Coordinates
              </div>
              <div className="font-mono text-sm text-slate-300">
                {lat.toFixed(6)}° N, {lng.toFixed(6)}° E
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Location on Map</h3>
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-indigo-500/10 h-96">
              <LeafletMap lat={lat} lng={lng} pgs={[pg]} />
            </div>
          </div>
        </div>

        {/* Back to Explore */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-medium hover:bg-slate-800/80 hover:border-slate-600 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Explore
          </Link>
        </div>
      </div>
    </div>
  );
}

function getAmenityIcon(amenity: string): string {
  const icons: Record<string, string> = {
    WiFi: "📶",
    AC: "❄️",
    Food: "🍽️",
    Gym: "💪",
    Laundry: "🧺",
    Parking: "🅿️",
    TV: "📺",
    "Power Backup": "🔋",
    CCTV: "📹",
    "Common Kitchen": "🍳",
    Lockers: "🔐",
    "Common Area": "🛋️",
    Library: "📚",
    "Study Room": "📖",
    "TV Room": "📺",
  };
  return icons[amenity] || "✅";
}
