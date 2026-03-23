"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLocation } from "@/hooks/useLocation";
import { usePGs } from "@/hooks/usePGs";
import LocationPicker from "@/components/LocationPicker";
import { type PG } from "@/hooks/usePG";
import { House, IndianRupee, MapPin, MessageSquareText, Search } from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 lg:h-125 rounded-xl overflow-hidden border border-slate-700 bg-linear-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 animate-skeleton-shimmer" />
  ),
});

export default function ExplorePage() {
  const { location, status, error, setManualLocation } = useLocation();
  const { data: pgs, isLoading: pgsLoading } = usePGs(location?.lat, location?.lng);

  const hasLocation = status === "granted" && location;

  return (
    <div className="min-h-screen bg-slate-950">
      {!hasLocation ? (
        <LocationPicker
          status={status}
          error={error}
          onSelectArea={setManualLocation}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fadeInUp space-y-8">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-sm font-semibold shadow-lg shadow-emerald-500/10">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-emerald-300 inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Active Location
              </span>
              {pgs && (
                <>
                  <span className="border-l border-emerald-400/30" />
                  <span className="text-emerald-200 font-bold">
                    {pgs.length} {pgs.length === 1 ? "PG" : "PGs"}
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
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium text-slate-300">Searching nearby...</p>
                  <p className="text-sm text-slate-500">Finding the best PGs for you</p>
                </div>
              </div>
            )}

            {pgs && pgs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Nearby PGs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pgs.map((pg: PG) => (
                    <Link
                      key={pg._id}
                      href={`/pg/${pg._id}`}
                      className="group h-full"
                    >
                      <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-indigo-500/50 transition-all hover:bg-slate-800/90 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1.5 cursor-pointer backdrop-blur-sm">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="mb-2 w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                              <House className="w-5 h-5 text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-bold line-clamp-2 text-slate-100 group-hover:text-indigo-300 transition-colors">{pg.name}</h3>
                          </div>
                          {pg.ratings && pg.ratings.count > 0 && (
                            <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/30 to-orange-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold whitespace-nowrap">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              {pg.ratings.avg.toFixed(1)}
                            </div>
                          )}
                        </div>

                        {/* Address */}
                        {pg.address && (
                          <div className="flex items-start gap-2 mb-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <p className="text-sm text-slate-300 line-clamp-2">{pg.address}</p>
                          </div>
                        )}

                        {/* Rent and Stats */}
                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                          {pg.rent && (pg.rent.min || pg.rent.max) ? (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold inline-flex items-center gap-1.5">
                                <IndianRupee className="w-3.5 h-3.5" />
                                Rent
                              </span>
                              <span className="font-bold text-emerald-400">
                                {pg.rent.min && pg.rent.max
                                  ? `₹${pg.rent.min.toLocaleString()} – ₹${pg.rent.max.toLocaleString()}`
                                  : pg.rent.min
                                    ? `From ₹${pg.rent.min.toLocaleString()}`
                                    : `Up to ₹${pg.rent.max!.toLocaleString()}`}
                              </span>
                            </div>
                          ) : null}

                          {pg.ratings && pg.ratings.count > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold inline-flex items-center gap-1.5">
                                <MessageSquareText className="w-3.5 h-3.5" />
                                Reviews
                              </span>
                              <span className="text-sm font-semibold text-slate-300">{pg.ratings.count}</span>
                            </div>
                          )}
                        </div>

                        {/* View Details Button */}
                        <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all">
                          View details
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {pgs && pgs.length === 0 && !pgsLoading && (
              <div className="text-center py-20 px-6 rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50">
                <div className="inline-flex mb-6 p-4 rounded-full bg-slate-800/50 border border-slate-700/50">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-slate-100">No PGs found nearby</h3>
                <p className="text-slate-400 text-lg max-w-md mx-auto mb-6">Try selecting a different area, expanding the search radius, or check back later for new listings</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
