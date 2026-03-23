"use client";

import { useState, useEffect, useCallback } from "react";

export type LocationStatus = "idle" | "prompting" | "granted" | "denied";

export interface LocationState {
  lat: number;
  lng: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Auto-prompt on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setStatus("denied");
      return;
    }

    setStatus("prompting");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("granted");
        setError(null);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Enable location for instant results");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable");
            break;
          case err.TIMEOUT:
            setError("Location request timed out");
            break;
          default:
            setError("An unknown error occurred");
        }
        setStatus("denied");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache position for 5 minutes
      }
    );
  }, []);

  // For manual selection (dropdown fallback)
  const setManualLocation = useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng });
    setStatus("granted");
    setError(null);
  }, []);

  return { location, status, error, setManualLocation };
}