"use client";


import { PUNE_AREAS, PUNE_CENTER } from "@/lib/pune-areas";
import type { LocationStatus } from "@/hooks/useLocation";
import { Compass, History, LocateFixed, MapPin, Search, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface LocationPickerProps {
  status: LocationStatus;
  error: string | null;
  onSelectArea: (lat: number, lng: number) => void;
}

const POPULAR_AREAS = [
  "Koregaon Park",
  "Viman Nagar",
  "Hinjewadi",
  "Kothrud",
  "Baner",
  "Wakad",
];

const AREA_META: Record<string, { listings: number; badge: string }> = {
  "Koregaon Park": { listings: 120, badge: "Lifestyle" },
  "Viman Nagar": { listings: 98, badge: "Airport zone" },
  Hinjewadi: { listings: 168, badge: "IT hub" },
  Kothrud: { listings: 93, badge: "Student favorite" },
  Baner: { listings: 116, badge: "Cafe district" },
  Wakad: { listings: 101, badge: "Fast growing" },
};

const RECENT_KEY = "dwellr_recent_area_searches";

export default function LocationPicker({ status, error, onSelectArea }: LocationPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
});

  const filteredAreas = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return PUNE_AREAS.slice(0, 8);
    return PUNE_AREAS.filter((area) => area.name.toLowerCase().includes(q)).slice(0, 8);
  }, [searchTerm]);

  const saveRecentSearch = (name: string) => {
    const updated = [name, ...recentSearches.filter((r) => r !== name)].slice(0, 5);
    setRecentSearches(updated);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // no-op when storage is unavailable
    }
  };

  const handleAreaSelect = (area: typeof PUNE_AREAS[0]) => {
    setSelectedArea(area.name);
    setSearchTerm(area.name);
    setIsOpen(false);
    saveRecentSearch(area.name);
    onSelectArea(area.lat, area.lng);
  };

  const handleNearMe = () => {
    const name = "Near me";
    setSelectedArea(name);
    setSearchTerm(name);
    setIsOpen(false);
    saveRecentSearch(name);
    onSelectArea(PUNE_CENTER.lat, PUNE_CENTER.lng);
  };

  const handlePopularClick = (name: string) => {
    const area = PUNE_AREAS.find((a) => a.name === name);
    if (area) handleAreaSelect(area);
  };

  const recentAreaObjects = recentSearches
    .map((name) => PUNE_AREAS.find((a) => a.name === name))
    .filter((a): a is (typeof PUNE_AREAS)[0] => Boolean(a));

  const shouldShowManual = status === "idle" || status === "prompting" || status === "denied";

  if (!shouldShowManual) {
    return null;
  }

  return (
    <section className="relative overflow-hidden h-screen w-full bg-slate-950/85 backdrop-blur-xl">
      <style>{`
        @keyframes hero-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%,100% { opacity: 0.45; transform: scale(0.95); }
          50% { opacity: 0.75; transform: scale(1.06); }
        }
        @keyframes list-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-bg {
          background: radial-gradient(65% 80% at 20% 25%, rgba(56, 189, 248, 0.14), transparent 60%),
                      radial-gradient(55% 70% at 80% 30%, rgba(99, 102, 241, 0.18), transparent 62%),
                      radial-gradient(70% 90% at 55% 110%, rgba(168, 85, 247, 0.12), transparent 65%),
                      linear-gradient(120deg, rgba(15, 23, 42, 0.97), rgba(10, 15, 30, 0.98), rgba(17, 24, 39, 0.97));
          background-size: 220% 220%;
          animation: hero-gradient-shift 14s ease-in-out infinite;
        }
        .hero-grid {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.16) 1.2px, transparent 0),
            linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px);
          background-size: 22px 22px, 88px 88px, 88px 88px;
          mask-image: radial-gradient(circle at 50% 45%, black 35%, transparent 95%);
          opacity: 0.22;
        }
        .fade-up { animation: fade-up .45s ease-out forwards; }
        .glow-pulse { animation: glow-pulse 3.4s ease-in-out infinite; }
        .list-in { animation: list-in .2s ease-out forwards; }
      `}</style>

      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 hero-grid" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10 h-full items-center">
          <div className="fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200 mb-6">
            <Compass className="w-3.5 h-3.5" />
            Trending near Pune
          </div>


          <h2 className="text-4xl md:text-3xl font-bold tracking-tight text-white leading-tight mb-4">
            <span className="text-indigo-400">Discover</span> Pune Around You
          </h2>
          <p className="text-slate-300/90 text-lg mb-3">
            Find the best places, deals, and services near you in seconds.
          </p>
          <p className="text-slate-400 text-sm mb-4 max-w-xl">
            {status === "prompting"
              ? "Trying to detect your location while you can still choose an area manually."
              : error || "Choose an area, landmark, or use a smart quick action to begin."}
          </p>

         

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleNearMe}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
            >
              <LocateFixed className="w-4 h-4" />
              Near me
            </button>
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-600/60 bg-slate-800/40 text-slate-200 font-semibold hover:border-indigo-400/40 hover:bg-slate-800/70 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Quick pick areas
            </button>
          </div>
           <Image
            src="/image.png"
            alt="Discover Pune"
            width={500}
            height={100}
            className="w-full max-w-sm h-auto object-top-right "
          />
        </div>
        

          <div className="fade-up [animation-delay:.08s]">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-xl p-5 shadow-2xl shadow-slate-950/50">
            <div className="relative mb-4">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                autoFocus={status === "denied"}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search for area, street, or landmark..."
                className="w-full h-14 pl-12 pr-10 rounded-2xl bg-slate-800/55 border border-slate-600/40 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />

              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-600 transition-all"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

              {isOpen && (
                <>
                  <button className="fixed inset-0 z-10" aria-label="Close suggestions" onClick={() => setIsOpen(false)} />
                  <div className="list-in absolute z-20 mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl overflow-hidden shadow-2xl shadow-slate-950/80">
                    <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                      <button
                        onClick={handleNearMe}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-500/15 transition-all text-slate-200 flex items-center gap-2.5"
                      >
                        <LocateFixed className="w-4 h-4 text-indigo-300" />
                        <span>Near me</span>
                      </button>

                      {recentAreaObjects.length > 0 && (
                        <>
                          <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-slate-500 font-semibold inline-flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" /> Recent searches
                          </p>
                          {recentAreaObjects.map((area) => (
                            <button
                              key={`recent-${area.name}`}
                              onClick={() => handleAreaSelect(area)}
                              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-slate-200 flex items-center gap-2.5"
                            >
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span>{area.name}</span>
                            </button>
                          ))}
                        </>
                      )}

                      <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-slate-500 font-semibold inline-flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Popular areas
                      </p>
                      {POPULAR_AREAS.map((name) => {
                        const area = PUNE_AREAS.find((a) => a.name === name);
                        if (!area) return null;
                        return (
                          <button
                            key={`popular-${name}`}
                            onClick={() => handleAreaSelect(area)}
                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-slate-200 flex items-center justify-between gap-2"
                          >
                            <span className="inline-flex items-center gap-2.5">
                              <MapPin className="w-4 h-4 text-indigo-300" />
                              <span>{name}</span>
                            </span>
                            <span className="text-[11px] text-slate-400">{AREA_META[name]?.listings ?? 80} listings</span>
                          </button>
                        );
                      })}

                      {filteredAreas.length > 0 && (
                        <>
                          <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Matches</p>
                          {filteredAreas.map((area) => (
                            <button
                              key={`match-${area.name}`}
                              onClick={() => handleAreaSelect(area)}
                              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-slate-200 flex items-center gap-2.5"
                            >
                              <MapPin className="w-4 h-4 text-cyan-300" />
                              <span>{area.name}</span>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Popular Areas</p>
              <p className="text-xs text-slate-500">Tap to select instantly</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POPULAR_AREAS.map((name) => {
                const meta = AREA_META[name];
                return (
                  <button
                    key={name}
                    onClick={() => handlePopularClick(name)}
                    className={`relative overflow-hidden text-left p-4 rounded-2xl border transition-all group active:scale-[0.98] ${
                      selectedArea === name
                        ? "border-indigo-400/60 bg-linear-to-br from-indigo-500/20 to-purple-500/10 shadow-lg shadow-indigo-900/30"
                        : "border-slate-700/70 bg-linear-to-br from-slate-800/80 to-slate-900/80 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 text-slate-200 font-semibold mb-1">
                        <MapPin className="w-4 h-4 text-indigo-300" />
                        {name}
                      </div>
                      <p className="text-xs text-slate-400">{meta?.listings ?? 80} listings</p>
                      <p className="mt-2 text-[11px] uppercase tracking-wide text-indigo-300/80">{meta?.badge ?? "Popular"}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}