"use client";

import { useState } from "react";

export function useLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setError("Permission denied or failed");
      }
    );
  };

  return { location, error, getLocation };
}