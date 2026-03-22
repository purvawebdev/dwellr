"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePG } from "@/hooks/usePG";

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
