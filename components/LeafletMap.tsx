"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { PGData } from "@/features/pg/pg.types";

// Fix Leaflet's default icon paths (broken by webpack bundling)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom user location icon (blue)
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom PG marker icon (red)
const pgIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to recenter map when coordinates change
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14, { animate: true });
  }, [lat, lng, map]);
  return null;
}

interface LeafletMapProps {
  lat: number;
  lng: number;
  pgs: PGData[];
}

export default function LeafletMap({ lat, lng, pgs }: LeafletMapProps) {
  const formatRent = (pg: PGData) => {
    if (!pg.rent) return "Rent: N/A";
    if (pg.rent.min && pg.rent.max) return `₹${pg.rent.min.toLocaleString()} – ₹${pg.rent.max.toLocaleString()}/mo`;
    if (pg.rent.min) return `From ₹${pg.rent.min.toLocaleString()}/mo`;
    if (pg.rent.max) return `Up to ₹${pg.rent.max.toLocaleString()}/mo`;
    return "Rent: N/A";
  };

  const formatRating = (pg: PGData) => {
    if (!pg.ratings || pg.ratings.count === 0) return "No ratings yet";
    return `⭐ ${pg.ratings.avg.toFixed(1)} (${pg.ratings.count} review${pg.ratings.count > 1 ? "s" : ""})`;
  };

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap lat={lat} lng={lng} />

      {/* User's location marker */}
      <Marker position={[lat, lng]} icon={userIcon}>
        <Popup>
          <div style={{ textAlign: "center", fontWeight: 600 }}>
            📍 You are here
          </div>
        </Popup>
      </Marker>

      {/* PG markers */}
      {pgs?.map((pg) => (
        <Marker
          key={pg._id}
          position={[pg.location.coordinates[1], pg.location.coordinates[0]]}
          icon={pgIcon}
        >
          <Popup>
            <div style={{ minWidth: "180px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px", color: "#1a1a2e" }}>
                🏠 {pg.name}
              </div>
              {pg.address && (
                <div style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>
                  {pg.address}
                </div>
              )}
              <div style={{ fontSize: "13px", color: "#2d6a4f", fontWeight: 600, marginBottom: "2px" }}>
                {formatRent(pg)}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {formatRating(pg)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
