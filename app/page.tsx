"use client";

import { useLocation } from "@/hooks/uselocation";
import { usePGs } from "@/hooks/usePGs";
import MapView from "@/components/MapView";

export default function Home() {
  const { location, error, getLocation } = useLocation();

  const { data: pgs, isLoading } = usePGs(
    location?.lat,
    location?.lng
  );

  return (
    <div className="p-4">
      <button
        onClick={getLocation}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Use My Location
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {isLoading && <p>Loading...</p>}

      {location && pgs && (
        <MapView lat={location.lat} lng={location.lng} pgs={pgs} />
      )}
    </div>
  );
}