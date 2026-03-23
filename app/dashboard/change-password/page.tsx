"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ZodIssue } from "zod/v3";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FieldError {
  [key: string]: string[];
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { isHydrated, user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if not authenticated
  if (isHydrated && !user) {
    router.push("/auth");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies in request
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
          setError(data.message || "Failed to change password");
        }
        return;
      }

      setSuccess("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect after success
      setTimeout(() => {
        if (user?.role === "superadmin") {
          router.push("/dashboard/superadmin");
        } else if (user?.role === "pg_owner") {
          router.push("/dashboard/pg-owner");
        } else {
          router.push("/explore");
        }
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Change Password</h1>
          <p className="text-slate-400">Update your account password</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-800 border rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.currentPassword
                      ? "border-red-500"
                      : "border-slate-700"
                  }`}
                  placeholder="Enter current password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.currentPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.currentPassword[0]}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-800 border rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.newPassword
                      ? "border-red-500"
                      : "border-slate-700"
                  }`}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <div className="text-red-400 text-xs mt-1 space-y-1">
                  {fieldErrors.newPassword.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}
              <p className="text-gray-400 text-xs mt-2">
                Password must contain:
                <br />
                • At least 12 characters
                <br />
                • Uppercase letter, lowercase letter, number, and special character
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-800 border rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-700"
                  }`}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded transition-colors"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <Link href="/explore" className="text-blue-400 hover:text-blue-300">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
