"use client";

import { PUNE_AREAS } from "@/lib/pune-areas";
import type { LocationStatus } from "@/hooks/useLocation";
import { useState } from "react";

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

export default function LocationPicker({ status, error, onSelectArea }: LocationPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");

  const filteredAreas = PUNE_AREAS.filter((area) =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAreaSelect = (area: typeof PUNE_AREAS[0]) => {
    setSelectedArea(area.name);
    setSearchTerm(area.name);
    setIsOpen(false);
    onSelectArea(area.lat, area.lng);
  };

  const handlePopularClick = (name: string) => {
    const area = PUNE_AREAS.find((a) => a.name === name);
    if (area) handleAreaSelect(area);
  };

  if (status === "idle" || status === "prompting") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <style>{`
          @keyframes spin-slow { to { transform: rotate(360deg); } }
          @keyframes spin-reverse { to { transform: rotate(-360deg); } }
          @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
          @keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .spin-slow { animation: spin-slow 8s linear infinite; }
          .spin-reverse { animation: spin-reverse 6s linear infinite; }
          .float { animation: float 3s ease-in-out infinite; }
          .fade-up { animation: fade-up 0.5s ease-out forwards; }
          .dot-1 { animation: bounce 1s ease-in-out infinite; }
          .dot-2 { animation: bounce 1s ease-in-out 0.15s infinite; }
          .dot-3 { animation: bounce 1s ease-in-out 0.3s infinite; }
        `}</style>
        <div className="fade-up text-center max-w-sm w-full">
          {/* Animated location icon */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="spin-slow absolute w-24 h-24 rounded-full border border-dashed border-indigo-500/30" />
            <div className="spin-reverse absolute w-16 h-16 rounded-full border border-dashed border-purple-500/40" />
            <div className="float relative w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Finding your location
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Allow location access to discover PGs near you in Pune
          </p>

          <div className="flex gap-1.5 justify-center">
            <div className="dot-1 w-2 h-2 rounded-full bg-indigo-400" />
            <div className="dot-2 w-2 h-2 rounded-full bg-purple-400" />
            <div className="dot-3 w-2 h-2 rounded-full bg-pink-400" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-2 py-1">
        <style>{`
          @keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes slide-down { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
          .fade-up { animation: fade-up 0.4s ease-out forwards; }
          .slide-down { animation: slide-down 0.2s ease-out forwards; }
          .area-btn:hover .area-icon { color: rgb(129 140 248); transform: scale(1.1); }
          .area-icon { transition: all 0.15s ease; }
        `}</style>

        <div className="fade-up w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Where are you in Pune?</h2>
            <p className="text-slate-500 text-sm">
              {error ? error : "Select your area to find nearby PGs"}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search area in Pune..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(""); setSelectedArea(""); setIsOpen(false); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Dropdown */}
            {isOpen && searchTerm && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                <div className="slide-down absolute z-20 w-full mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="max-h-52 overflow-y-auto">
                    {filteredAreas.length > 0 ? (
                      filteredAreas.map((area) => (
                        <button
                          key={area.name}
                          onClick={() => handleAreaSelect(area)}
                          className="area-btn w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                        >
                          <svg className="area-icon w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                            {area.name}
                          </span>
                          {selectedArea === area.name && (
                            <svg className="w-4 h-4 text-indigo-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12" strokeWidth="2.5" />
                            </svg>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-slate-500 text-sm">
                        No areas found for &quot;{searchTerm}&quot;
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Popular Areas */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Popular areas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_AREAS.map((name) => (
                <button
                  key={name}
                  onClick={() => handlePopularClick(name)}
                  className={`area-btn flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                    selectedArea === name
                      ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-300"
                      : "bg-slate-800/50 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                  }`}
                >
                  <svg className="area-icon w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}