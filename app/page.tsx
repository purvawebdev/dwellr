"use client";

import dynamic from "next/dynamic";
import { useLocation } from "@/hooks/useLocation";
import { usePGs } from "@/hooks/usePGs";
import LocationPicker from "@/components/LocationPicker";

// Leaflet requires `window`, so we must disable SSR
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="map-skeleton">
      <div className="map-skeleton-pulse" />
    </div>
  ),
});

export default function Home() {
  const { location, status, error, setManualLocation } = useLocation();
  const { data: pgs, isLoading: pgsLoading } = usePGs(location?.lat, location?.lng);

  const hasLocation = status === "granted" && location;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-group">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="logo-text">dwellr</h1>
          </div>
          <p className="header-tagline">Discover PGs near you</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Location Picker (shown when prompting or denied) */}
        {!hasLocation && (
          <LocationPicker
            status={status}
            error={error}
            onSelectArea={setManualLocation}
          />
        )}

        {/* Map + Results (shown when location is available) */}
        {hasLocation && (
          <div className="map-results-section">
            {/* Location Badge */}
            <div className="location-badge">
              <span className="location-badge-dot" />
              <span className="location-badge-text">
                📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
              {pgs && (
                <span className="location-badge-count">
                  {pgs.length} PG{pgs.length !== 1 ? "s" : ""} nearby
                </span>
              )}
            </div>

            {/* Map */}
            <div className="map-wrapper">
              <LeafletMap
                lat={location.lat}
                lng={location.lng}
                pgs={pgs || []}
              />
            </div>

            {/* PG Cards List */}
            {pgsLoading && (
              <div className="pg-loading">
                <div className="pg-loading-spinner" />
                <span>Searching for PGs nearby...</span>
              </div>
            )}

            {pgs && pgs.length > 0 && (
              <div className="pg-cards-section">
                <h2 className="pg-cards-title">Nearby PGs</h2>
                <div className="pg-cards-grid">
                  {pgs.map((pg: any) => (
                    <div key={pg._id} className="pg-card">
                      <div className="pg-card-header">
                        <h3 className="pg-card-name">🏠 {pg.name}</h3>
                        {pg.ratings && pg.ratings.count > 0 && (
                          <span className="pg-card-rating">
                            ⭐ {pg.ratings.avg.toFixed(1)}
                          </span>
                        )}
                      </div>
                      {pg.address && (
                        <p className="pg-card-address">{pg.address}</p>
                      )}
                      <div className="pg-card-footer">
                        {pg.rent && (pg.rent.min || pg.rent.max) ? (
                          <span className="pg-card-rent">
                            {pg.rent.min && pg.rent.max
                              ? `₹${pg.rent.min.toLocaleString()} – ₹${pg.rent.max.toLocaleString()}`
                              : pg.rent.min
                                ? `From ₹${pg.rent.min.toLocaleString()}`
                                : `Up to ₹${pg.rent.max.toLocaleString()}`
                            }
                            <span className="rent-period">/mo</span>
                          </span>
                        ) : (
                          <span className="pg-card-rent rent-na">Rent: N/A</span>
                        )}
                        {pg.ratings && pg.ratings.count > 0 && (
                          <span className="pg-card-reviews">
                            {pg.ratings.count} review{pg.ratings.count > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pgs && pgs.length === 0 && !pgsLoading && (
              <div className="pg-empty">
                <div className="pg-empty-icon">🔍</div>
                <h3>No PGs found nearby</h3>
                <p>Try selecting a different area or expanding the search radius</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Dwellr · Built for students, by students</p>
      </footer>
    </div>
  );
}