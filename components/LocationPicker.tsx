"use client";

import { PUNE_AREAS } from "@/lib/pune-areas";
import type { LocationStatus } from "@/hooks/useLocation";

interface LocationPickerProps {
  status: LocationStatus;
  error: string | null;
  onSelectArea: (lat: number, lng: number) => void;
}

export default function LocationPicker({ status, error, onSelectArea }: LocationPickerProps) {
  if (status === "idle" || status === "prompting") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-sm text-center p-12 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 animate-fadeInUp">
          <div className="inline-flex items-center justify-center mb-6 animate-pulse-glow">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-400"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Finding your location...</h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Please allow location access in the browser prompt to discover PGs near you
          </p>
          <div className="flex gap-2 justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "-0.32s" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "-0.16s" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-sm text-center p-12 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-xl shadow-2xl shadow-red-500/10 animate-fadeInUp">
          <div className="inline-flex items-center justify-center mb-6 text-red-400">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Location access denied</h2>
          {error && <p className="text-xs text-slate-500 mb-3">{error}</p>}
          <p className="text-slate-400 mb-8">No worries! Select your area in Pune manually:</p>

          <div className="relative">
            <select
              className="w-full px-4 py-3 rounded-lg bg-slate-700/40 border border-slate-600 text-slate-100 font-medium cursor-pointer appearance-none transition-all hover:border-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              defaultValue=""
              onChange={(e) => {
                const area = PUNE_AREAS.find((a) => a.name === e.target.value);
                if (area) onSelectArea(area.lat, area.lng);
              }}
            >
              <option value="" disabled>
                — Choose your area —
              </option>
              {PUNE_AREAS.map((area) => (
                <option key={area.name} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
