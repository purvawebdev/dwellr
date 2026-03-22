"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapView({
  lat,
  lng,
  pgs,
}: {
  lat: number;
  lng: number;
  pgs: any[];
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 13,
    });

    // user marker
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([lng, lat])
      .addTo(map);

    // PG markers
    pgs?.forEach((pg) => {
      new mapboxgl.Marker()
        .setLngLat(pg.location.coordinates)
        .addTo(map);
    });

    return () => map.remove();
  }, [lat, lng, pgs]);

  return <div ref={mapRef} className="w-full h-[500px]" />;
}