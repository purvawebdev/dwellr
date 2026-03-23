"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

interface PGWithRatings {
  _id: string;
  name: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  ratings: {
    avg: number;
    count: number;
  };
  createdAt: string;
}

export default function PGOwnerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const [pgs, setPGs] = useState<PGWithRatings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not a PG owner (after hydration)
  useEffect(() => {
    if (isHydrated && (!isAuthenticated || user?.role !== "pg_owner")) {
      router.push("/explore");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  const fetchPGs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/pgs/my-pgs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.data.success) {
        setPGs(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching PGs:", err);
      setError("Failed to load your PGs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPGs();
    }
  }, [isAuthenticated, fetchPGs]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Link href="/auth" className="text-indigo-400 underline">
          Login to access dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My PGs</h1>
          <p className="text-slate-400">Manage your property listings</p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total PGs</p>
              <p className="text-3xl font-bold">{pgs.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold text-emerald-400">
                {pgs.filter((p) => p.status === "approved").length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-400">
                {pgs.filter((p) => p.status === "pending").length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total Ratings</p>
              <p className="text-3xl font-bold text-indigo-400">
                {pgs.reduce((sum, p) => sum + p.ratings.count, 0)}
              </p>
            </div>
          </div>
        )}

        {/* Add PG Button */}
        <div className="mb-8">
          <Link
            href="/dashboard/pg-owner/add-pg"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            + Add New PG
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
              <span>Loading your PGs...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* PG List */}
        {!loading && pgs.length > 0 ? (
          <div className="space-y-6">
            {pgs.map((pg) => (
              <div
                key={pg._id}
                className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{pg.name}</h3>
                    <p className="text-slate-400 flex items-center gap-2">
                      📍 {pg.address}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0 ml-4">
                    {pg.status === "approved" && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                        ✅ Approved
                      </span>
                    )}
                    {pg.status === "pending" && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold">
                        ⏳ Pending
                      </span>
                    )}
                    {pg.status === "rejected" && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold">
                        ❌ Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Rejection Reason */}
                {pg.status === "rejected" && pg.rejectionReason && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                    <p className="text-sm font-medium text-red-300 mb-1">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-red-200">{pg.rejectionReason}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-400 mb-1">Ratings</p>
                    <p className="text-lg font-bold text-slate-100">
                      {pg.ratings.count} review{pg.ratings.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-400 mb-1">Avg Rating</p>
                    <p className="text-lg font-bold text-amber-300">
                      {pg.ratings.avg > 0 ? pg.ratings.avg.toFixed(1) : "N/A"}⭐
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-400 mb-1">Listed</p>
                    <p className="text-lg font-bold text-slate-100">
                      {new Date(pg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/pg/${pg._id}`}
                    className="px-4 py-2 rounded-lg border border-slate-600 text-slate-100 font-medium hover:bg-slate-700 transition-all text-sm"
                  >
                    View Listing
                  </Link>
                  <Link
                    href={`/dashboard/pg-owner/pgs/${pg._id}`}
                    className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 font-medium hover:bg-slate-600 transition-all text-sm"
                  >
                    View Reviews
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">
                You haven&apos;t added any PGs yet
              </p>
              <Link
                href="/dashboard/pg-owner/add-pg"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all"
              >
                Add Your First PG
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
