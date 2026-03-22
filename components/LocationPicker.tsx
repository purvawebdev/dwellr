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
      <div className="location-picker-container">
        <div className="location-prompt-card">
          <div className="prompt-icon-pulse">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2 className="prompt-title">Finding your location...</h2>
          <p className="prompt-subtitle">
            Please allow location access in the browser prompt to discover PGs near you
          </p>
          <div className="prompt-loader">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="location-picker-container">
        <div className="location-denied-card">
          <div className="denied-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <h2 className="denied-title">Location access denied</h2>
          {error && <p className="denied-error">{error}</p>}
          <p className="denied-subtitle">No worries! Select your area in Pune manually:</p>

          <div className="area-dropdown-wrapper">
            <select
              className="area-dropdown"
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
            <div className="dropdown-chevron">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
