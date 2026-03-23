"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

interface PGWithOwner {
  _id: string;
  name: string;
  address: string;
  ownerId: {
    _id: string;
    name: string;
    email: string;
  } | string | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  ratings: {
    avg: number;
    count: number;
  };
  createdAt: string;
}

export default function SuperadminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const [pgs, setPGs] = useState<PGWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Redirect if not a superadmin (after hydration)
  useEffect(() => {
    if (isHydrated && (!isAuthenticated || user?.role !== "superadmin")) {
      router.push("/explore");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  const fetchPGs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/pgs/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.data.success) {
        setPGs(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching PGs:", err);
      setError("Failed to load PGs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPGs();
    }
  }, [isAuthenticated, fetchPGs]);

  const handleApprove = async (pgId: string) => {
    try {
      const response = await axios.patch(
        `/api/pgs/${pgId}/status`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.success) {
        setPGs(pgs.map((p) => (p._id === pgId ? { ...p, status: "approved" } : p)));
      }
    } catch (err) {
      console.error("Error approving PG:", err);
      alert("Failed to approve PG");
    }
  };

  const handleReject = async (pgId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    try {
      const response = await axios.patch(
        `/api/pgs/${pgId}/status`,
        { status: "rejected", rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.success) {
        setPGs(
          pgs.map((p) =>
            p._id === pgId
              ? { ...p, status: "rejected", rejectionReason }
              : p
          )
        );
        setRejectingId(null);
        setRejectionReason("");
      }
    } catch (err) {
      console.error("Error rejecting PG:", err);
      alert("Failed to reject PG");
    }
  };

  const filteredPGs = pgs.filter(
    (pg) => filter === "all" || pg.status === filter
  );

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Superadmin Dashboard</h1>
          <p className="text-slate-400">Manage and approve PG listings</p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total PGs</p>
              <p className="text-3xl font-bold">{pgs.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-amber-400">
                {pgs.filter((p) => p.status === "pending").length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold text-emerald-400">
                {pgs.filter((p) => p.status === "approved").length}
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

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
              <span>Loading PGs...</span>
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
        {!loading && filteredPGs.length > 0 ? (
          <div className="space-y-6">
            {filteredPGs.map((pg) => (
              <div
                key={pg._id}
                className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{pg.name}</h3>
                    <p className="text-slate-400 mb-2">📍 {pg.address}</p>
                    {pg.ownerId ? (
                      <p className="text-sm text-slate-500">
                        Owner: {typeof pg.ownerId === "string" ? pg.ownerId : pg.ownerId.name}{" "}
                        {typeof pg.ownerId !== "string" && `(${pg.ownerId.email})`}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">Owner: Unknown</p>
                    )}
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
                <div className="grid grid-cols-3 gap-4 mb-6">
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
                    <p className="text-xs text-slate-400 mb-1">Submitted</p>
                    <p className="text-lg font-bold text-slate-100">
                      {new Date(pg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {pg.status === "pending" && (
                  <div className="space-y-3">
                    {rejectingId === pg._id ? (
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-sm font-medium text-red-300 mb-2">
                          Rejection Reason:
                        </p>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-700/40 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 mb-2 resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(pg._id)}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-all text-sm"
                          >
                            Confirm Rejection
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason("");
                            }}
                            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-100 font-medium hover:bg-slate-700 transition-all text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(pg._id)}
                          className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-all text-sm"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => setRejectingId(pg._id)}
                          className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-all text-sm"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {pg.status !== "pending" && (
                  <Link
                    href={`/pg/${pg._id}`}
                    className="inline-flex px-4 py-2 rounded-lg border border-slate-600 text-slate-100 font-medium hover:bg-slate-700 transition-all text-sm"
                  >
                    View Listing
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-slate-400">
                No {filter !== "all" ? filter : ""} PGs at the moment
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
