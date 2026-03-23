"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ZodIssue } from "zod/v3";

const LeafletMapPicker = dynamic(
  () => import("@/components/LeafletMapPicker"),
  { ssr: false }
);

interface FormData {
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  minRent: number;
  maxRent: number;
  amenities: string[];
}

interface FieldError {
  [key: string]: string[];
}

const amenityOptions = [
  "WiFi",
  "AC",
  "Hot Water",
  "Parking",
  "Laundry",
  "Meals",
  "Furnished",
  "Unfurnished",
  "Study Room",
  "Common Area",
];

export default function AddPGPage() {
  const router = useRouter();
  const { user, isPGOwner, isHydrated } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    lat: null,
    lng: null,
    minRent: 5000,
    maxRent: 10000,
    amenities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});

  // Handle auth redirect in useEffect (not at top level)
  useEffect(() => {
    if (isHydrated && (!user || !isPGOwner)) {
      router.push("/explore");
    }
  }, [isHydrated, user, isPGOwner, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Rent") || name === "lat" || name === "lng"
          ? parseFloat(value) || 0
          : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
    setError("");
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setFormData((prev) => ({
        ...prev,
        lat,
        lng,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      if (!formData.name.trim()) {
        setError("PG name is required");
        setLoading(false);
        return;
      }

      if (!formData.address.trim()) {
        setError("Address is required");
        setLoading(false);
        return;
      }

      if (formData.lat === null || formData.lng === null) {
        setError("Please select a location on the map");
        setLoading(false);
        return;
      }

      if (formData.maxRent < formData.minRent) {
        setError("Maximum rent must be greater than minimum rent");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/pgs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          lat: formData.lat,
          lng: formData.lng,
          minRent: formData.minRent,
          maxRent: formData.maxRent,
          amenities: formData.amenities,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        if (data.errors && Array.isArray(data.errors)) {
          const newFieldErrors: FieldError = {};    
          data.errors.forEach((err: ZodIssue) => {
            const field = String(err.path?.[0] || "general");
            if (!newFieldErrors[field]) {
              newFieldErrors[field] = [];
            }
            newFieldErrors[field].push(err.message);
          });
          setFieldErrors(newFieldErrors);
          setError("Please fix the errors below");
        } else {
          setError(data.message || "Failed to create PG");
        }
        setLoading(false);
        return;
      }

      setSuccess(
        "PG created successfully! It will be visible after admin approval."
      );
      setTimeout(() => {
        router.push("/dashboard/pg-owner");
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4">
      {/* Show nothing while checking auth */}
      {!isHydrated || !user || !isPGOwner ? null : (
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/pg-owner"
            className="text-indigo-400 hover:text-indigo-300 mb-4 inline-flex items-center gap-1"
          >
            <span>←</span> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Add New PG</h1>
          <p className="text-slate-400">
            List your property and start accepting bookings
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PG Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                PG Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Green Haven Residency"
                className={`w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border ${
                  fieldErrors.name
                    ? "border-red-500"
                    : "border-slate-600 focus:border-indigo-500"
                } text-white placeholder-slate-500 focus:outline-none transition-all`}
              />
              {fieldErrors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address <span className="text-red-400">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street, Pune, Maharashtra"
                rows={2}
                className={`w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border ${
                  fieldErrors.address
                    ? "border-red-500"
                    : "border-slate-600 focus:border-indigo-500"
                } text-white placeholder-slate-500 focus:outline-none transition-all`}
              />
              {fieldErrors.address && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.address[0]}
                </p>
              )}
            </div>

            {/* Location Picker Map */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location on Map <span className="text-red-400">*</span>
              </label>
              <div className="h-80 rounded-lg border border-slate-600 overflow-hidden">
                <LeafletMapPicker onLocationSelect={handleLocationSelect} />
              </div>
              {formData.lat && formData.lng && (
                <p className="text-xs text-green-400 mt-2">
                  ✓ Location selected: {formData.lat.toFixed(4)},
                  {formData.lng.toFixed(4)}
                </p>
              )}
              {!formData.lat || !formData.lng ? (
                <p className="text-xs text-yellow-400 mt-2">
                  Click on the map to select a location
                </p>
              ) : null}
            </div>

            {/* Rent Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Min Rent (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="minRent"
                  value={formData.minRent}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className={`w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border ${
                    fieldErrors.minRent
                      ? "border-red-500"
                      : "border-slate-600 focus:border-indigo-500"
                  } text-white placeholder-slate-500 focus:outline-none transition-all`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Rent (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="maxRent"
                  value={formData.maxRent}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className={`w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border ${
                    fieldErrors.maxRent
                      ? "border-red-500"
                      : "border-slate-600 focus:border-indigo-500"
                  } text-white placeholder-slate-500 focus:outline-none transition-all`}
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-3">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 rounded accent-indigo-500"
                    />
                    <span className="text-sm text-slate-300">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8"
            >
              {loading ? "Creating..." : "Create PG Listing"}
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}
