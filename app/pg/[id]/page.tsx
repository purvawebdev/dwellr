"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect, useCallback, type ReactNode } from "react";
import axios from "axios";
import { usePG } from "@/hooks/usePG";
import { useAuth } from "@/hooks/useAuth";
import RatingForm from "@/components/RatingForm";
import {
  BatteryCharging,
  BookOpen,
  CheckCircle2,
  Cctv,
  Dumbbell,
  Frown,
  House,
  IndianRupee,
  Lock,
  MapPinned,
  MessageCircle,
  ParkingCircle,
  Shirt,
  Snowflake,
  Sofa,
  Sparkles,
  Star,
  ThumbsUp,
  Tv,
  Utensils,
  Wifi,
  Users,
} from "lucide-react";

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
          <div className="mb-4 inline-flex w-16 h-16 rounded-2xl bg-slate-800/70 border border-slate-700 items-center justify-center">
            <Frown className="w-9 h-9 text-slate-300" />
          </div>
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
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="w-16 h-16 mb-4 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <House className="w-9 h-9 text-indigo-300" />
                  </div>
                  <h1 className="text-5xl md:text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">{pg.name}</h1>
                </div>
                {pg.ratings && pg.ratings.count > 0 && (
                  <div className="flex-shrink-0">
                    <div className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span className="text-2xl font-bold text-amber-300">{pg.ratings.avg.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-amber-200 font-medium">{pg.ratings.count} {pg.ratings.count === 1 ? "review" : "reviews"}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Address */}
              {pg.address && (
                <div className="flex items-start gap-3 text-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-1 text-indigo-400">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-slate-300">{pg.address}</span>
                </div>
              )}
            </div>

            {/* Rent Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-green-600/10 border border-emerald-500/40 backdrop-blur-sm shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Monthly Rent</div>
                  <div className="text-xs text-emerald-300/60">Per person</div>
                </div>
              </div>
              <div className="text-4xl font-bold text-emerald-300">
                {pg.rent && (pg.rent.min || pg.rent.max) ? (
                  <>
                    {pg.rent.min && pg.rent.max
                      ? `₹${pg.rent.min.toLocaleString()} – ₹${pg.rent.max.toLocaleString()}`
                      : pg.rent.min
                        ? `From ₹${pg.rent.min.toLocaleString()}`
                        : `Up to ₹${pg.rent.max!.toLocaleString()}`}
                  </>
                ) : (
                  "Contact for pricing"
                )}
              </div>
            </div>

            {/* Amenities */}
            {pg.amenities && pg.amenities.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-bold">Amenities</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {pg.amenities.map((amenity: string) => (
                    <div
                      key={amenity}
                      className="group relative p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{getAmenityIcon(amenity)}</div>
                      <span className="text-sm font-semibold text-slate-200 line-clamp-2 group-hover:text-blue-300 transition-colors">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Form Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                    <Star className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-bold">
                    Reviews
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold">{ratings.length}</span>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowRatingForm(!showRatingForm)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    {showRatingForm ? "Close" : "Add Rating"}
                  </button>
                )}
              </div>

              {showRatingForm && isAuthenticated && (
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 backdrop-blur-sm">
                  <RatingForm pgId={id} onSubmitted={handleRatingSubmitted} />
                </div>
              )}

              {!isAuthenticated && (
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 text-center backdrop-blur-sm">
                  <div className="mb-3 inline-flex w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-300" />
                  </div>
                  <p className="text-blue-300 mb-4 font-medium">Login required to add a rating</p>
                  <Link href="/auth" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3H9a6 6 0 0 0-6 6v10a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6V9a6 6 0 0 0-6-6Z"/><polyline points="9 12 15 12"/></svg>
                    Login to Rate
                  </Link>
                </div>
              )}
            </div>

            {/* Ratings Display */}
            {loadingRatings ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                  <div className="w-6 h-6 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
                  <span className="text-sm">Loading reviews...</span>
                </div>
              </div>
            ) : ratings.length > 0 ? (
              <div className="space-y-5">
                {ratings.map((rating) => (
                  <div key={rating._id} className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/20 border border-slate-700/50 hover:border-slate-600/80 transition-all hover:shadow-lg hover:shadow-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                          {rating.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="font-bold text-slate-100 text-lg">{rating.userId?.name || "Anonymous"}</p>
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40">
                              <div className="flex gap-0.5">
                                {[...Array(rating.rating)].map((_, i) => (
                                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                ))}
                              </div>
                              <span className="text-xs font-bold text-amber-300 ml-1">{rating.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-slate-400 bg-slate-700/50 rounded-full px-2.5 py-1 inline-flex items-center gap-1.5">
                              {rating.source === "lived_here" && <House className="w-3.5 h-3.5" />}
                              {rating.source === "friend_told" && <Users className="w-3.5 h-3.5" />}
                              {rating.source === "other" && <MessageCircle className="w-3.5 h-3.5" />}
                              {rating.source === "lived_here" ? "Lived here" : rating.source === "friend_told" ? "Friend told" : "Other"}
                            </span>
                            <p className="text-xs text-slate-500">
                              {new Date(rating.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4 leading-relaxed text-base">{rating.review}</p>

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
                        <ThumbsUp className="w-3.5 h-3.5" /> <span>{rating.helpful} found this helpful</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/20 border border-slate-700/50 text-center backdrop-blur-sm">
                <div className="mb-4 inline-flex w-14 h-14 rounded-2xl bg-slate-800/70 border border-slate-700 items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 mb-6 text-lg">No reviews yet. Be the first to share your experience!</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowRatingForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z"/></svg>
                    Write First Review
                  </button>
                )}
              </div>
            )}


          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white">
                  <MapPinned className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold">Location</h3>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-indigo-500/20 h-96 backdrop-blur-sm">
                <LeafletMap lat={lat} lng={lng} pgs={[pg]} />
              </div>
              <div className="mt-5 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Coordinates</div>
                <div className="font-mono text-slate-300">{lat.toFixed(6)}° N<br/>{lng.toFixed(6)}° E</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Explore */}
        <div className="mt-16 pt-10 border-t border-slate-800/50">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 text-slate-100 font-semibold hover:border-slate-600 hover:from-slate-800 hover:to-slate-900 transition-all shadow-lg shadow-slate-900/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

function getAmenityIcon(amenity: string): ReactNode {
  const iconClass = "w-7 h-7 text-blue-300";
  const icons: Record<string, ReactNode> = {
    WiFi: <Wifi className={iconClass} />,
    AC: <Snowflake className={iconClass} />,
    Food: <Utensils className={iconClass} />,
    Gym: <Dumbbell className={iconClass} />,
    Laundry: <Shirt className={iconClass} />,
    Parking: <ParkingCircle className={iconClass} />,
    TV: <Tv className={iconClass} />,
    "Power Backup": <BatteryCharging className={iconClass} />,
    CCTV: <Cctv className={iconClass} />,
    "Common Kitchen": <Utensils className={iconClass} />,
    Lockers: <Lock className={iconClass} />,
    "Common Area": <Sofa className={iconClass} />,
    Library: <BookOpen className={iconClass} />,
    "Study Room": <BookOpen className={iconClass} />,
    "TV Room": <Tv className={iconClass} />,
  };
  return icons[amenity] || <CheckCircle2 className={iconClass} />;
}
