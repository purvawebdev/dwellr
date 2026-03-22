"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLocation } from "@/hooks/useLocation";
import { usePGs } from "@/hooks/usePGs";
import LocationPicker from "@/components/LocationPicker";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 lg:h-[500px] rounded-xl overflow-hidden border border-slate-700 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 animate-skeleton-shimmer" />
  ),
});

export default function ExplorePage() {
  const { location, status, error, setManualLocation } = useLocation();
  const { data: pgs, isLoading: pgsLoading } = usePGs(location?.lat, location?.lng);

  const hasLocation = status === "granted" && location;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Explore PGs</h1>
            <p className="text-slate-400">
              {hasLocation
                ? `Showing PGs near ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                : "Grant location access or select your area"}
            </p>
          </div>
          {hasLocation && (
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/80 transition-all text-sm font-medium whitespace-nowrap"
              onClick={() => window.location.reload()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Change Area
            </button>
          )}
        </div>

        {/* Location Picker */}
        {!hasLocation && (
          <LocationPicker
            status={status}
            error={error}
            onSelectArea={setManualLocation}
          />
        )}

        {/* Map + PG Results */}
        {hasLocation && (
          <div className="animate-fadeInUp space-y-8">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-dot-pulse shadow-lg shadow-emerald-500/50" />
              <span className="text-slate-300">
                📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
              {pgs && (
                <>
                  <span className="border-l border-slate-700" />
                  <span className="text-indigo-400 font-semibold">
                    {pgs.length} PG{pgs.length !== 1 ? "s" : ""} nearby
                  </span>
                </>
              )}
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-indigo-500/10">
              <LeafletMap
                lat={location.lat}
                lng={location.lng}
                pgs={pgs || []}
              />
            </div>

            {/* PG Cards */}
            {pgsLoading && (
              <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
                <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
                <span>Searching for PGs nearby...</span>
              </div>
            )}

            {pgs && pgs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Nearby PGs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pgs.map((pg: any) => (
                    <Link
                      key={pg._id}
                      href={`/pg/${pg._id}`}
                      className="group"
                    >
                      <div className="h-full p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all hover:bg-slate-800/80 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-lg font-semibold line-clamp-2">🏠 {pg.name}</h3>
                          {pg.ratings && pg.ratings.count > 0 && (
                            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold whitespace-nowrap">
                              ⭐ {pg.ratings.avg.toFixed(1)}
                            </span>
                          )}
                        </div>

                        {/* Address */}
                        {pg.address && (
                          <p className="text-sm text-slate-400 mb-4 line-clamp-2">{pg.address}</p>
                        )}

                        {/* Rent and Reviews */}
                        <div className="space-y-3 pt-4 border-t border-slate-700">
                          {pg.rent && (pg.rent.min || pg.rent.max) ? (
                            <div className="text-sm">
                              <span className="text-slate-400">Rent: </span>
                              <span className="font-semibold text-emerald-400">
                                {pg.rent.min && pg.rent.max
                                  ? `₹${pg.rent.min.toLocaleString()} – ₹${pg.rent.max.toLocaleString()}`
                                  : pg.rent.min
                                    ? `From ₹${pg.rent.min.toLocaleString()}`
                                    : `Up to ₹${pg.rent.max.toLocaleString()}`}
                              </span>
                              <span className="text-slate-500 text-xs"> /month</span>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-400">Rent: N/A</div>
                          )}

                          {pg.ratings && pg.ratings.count > 0 && (
                            <div className="text-xs text-slate-400">
                              {pg.ratings.count} review{pg.ratings.count > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>

                        {/* View Details Hint */}
                        <div className="mt-4 text-sm text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                          View details →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {pgs && pgs.length === 0 && !pgsLoading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No PGs found nearby</h3>
                <p className="text-slate-400">Try selecting a different area or expanding the search radius</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
