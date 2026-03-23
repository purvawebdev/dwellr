"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { passwordSchema, emailSchema } from "@/features/auth/auth.validation";
import { ZodError } from "zod";

type AuthMode = "login" | "signup";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  role?: "student" | "pg_owner";
}


interface FieldError {
  [key: string]: string[];
}

interface ZodIssue {
  path: (string | number)[];
  message: string;
}

// Password requirement helpers
const validatePassword = (password: string) => {
  const requirements = {
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  return requirements;
};

const extractFieldErrors = (error: ZodError<unknown>) => {
  const fieldErrors: FieldError = {};
  error.issues.forEach((issue) => {
    const field = String(issue.path[0]);
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(issue.message);
  });
  return fieldErrors;
};

export default function AuthPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, isHydrated } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case "superadmin":
          router.push("/dashboard/superadmin");
          break;
        case "pg_owner":
          router.push("/dashboard/pg-owner");
          break;
        default:
          router.push("/explore");
      }
    }
  }, [isHydrated, isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const payload =
        mode === "login"
          ? {
              action: "login",
              email: formData.email,
              password: formData.password,
            }
          : {
              action: "signup",
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              name: formData.name,
              role: formData.role,
            };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // Include cookies in request
      });

      const data = await res.json();

      if (!data.success) {
        // Check if it's validation errors from the server
        if (data.errors && Array.isArray(data.errors)) {
          const newFieldErrors: FieldError = {};
          data.errors.forEach((err: ZodIssue) => {
            const path = String(err.path?.[0] || "general");
            if (!newFieldErrors[path]) {
              newFieldErrors[path] = [];
            }
            newFieldErrors[path].push(err.message);
          });
          setFieldErrors(newFieldErrors);
          setError("Please fix the errors below");
        } else {
          setError(data.message || "Authentication failed");
        }
        return;
      }

      // Use the login hook to set auth state with user data only
      // Token is now stored in httpOnly cookie automatically
      if (data.user) {
        login(data.user);

        // Show success message
        setSuccess(mode === "login" ? "Login successful!" : "Signup successful!");

        // Redirect based on user role after brief delay for state sync
        setTimeout(() => {
          switch (data.user.role) {
            case "superadmin":
              router.push("/dashboard/superadmin");
              break;
            case "pg_owner":
              router.push("/dashboard/pg-owner");
              break;
            default:
              router.push("/explore");
          }
        }, 500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Dwellr</h1>
            <p className="text-slate-400">
              {mode === "login" ? "Welcome back!" : "Join our community"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg bg-slate-700/40 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                  }`}
                />
                {fieldErrors.name && (
                  <ul className="mt-1 space-y-0.5">
                    {fieldErrors.name.map((err, idx) => (
                      <li key={idx} className="text-xs text-red-400">
                        • {err}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg bg-slate-700/40 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.email ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                }`}
              />
              {fieldErrors.email && (
                <ul className="mt-1 space-y-0.5">
                  {fieldErrors.email.map((err, idx) => (
                    <li key={idx} className="text-xs text-red-400">
                      • {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 pr-10 rounded-lg bg-slate-700/40 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
              {mode === "signup" ? (
                <div className="mt-2 space-y-1">
                  {formData.password && (
                    <>
                      <div className="text-xs font-medium text-slate-300 mb-1.5">Password requirements:</div>
                      {(() => {
                        const reqs = validatePassword(formData.password);
                        return (
                          <div className="space-y-0.5">
                            <div className={`text-xs flex items-center gap-1.5 ${reqs.minLength ? "text-emerald-400" : "text-slate-500"}`}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                {reqs.minLength ? (
                                  <polyline points="20 6 9 17 4 12" />
                                ) : (
                                  <circle cx="12" cy="12" r="10" />
                                )}
                              </svg>
                              At least 6 characters
                            </div>
                            <div className={`text-xs flex items-center gap-1.5 ${reqs.hasUpperCase ? "text-emerald-400" : "text-slate-500"}`}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                {reqs.hasUpperCase ? (
                                  <polyline points="20 6 9 17 4 12" />
                                ) : (
                                  <circle cx="12" cy="12" r="10" />
                                )}
                              </svg>
                              One uppercase letter (A-Z)
                            </div>
                            <div className={`text-xs flex items-center gap-1.5 ${reqs.hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                {reqs.hasNumber ? (
                                  <polyline points="20 6 9 17 4 12" />
                                ) : (
                                  <circle cx="12" cy="12" r="10" />
                                )}
                              </svg>
                              One number (0-9)
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}
                  {fieldErrors.password && (
                    <ul className="mt-2 space-y-0.5">
                      {fieldErrors.password.map((err, idx) => (
                        <li key={idx} className="text-xs text-red-400">
                          • {err}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                fieldErrors.password && (
                  <ul className="mt-1 space-y-0.5">
                    {fieldErrors.password.map((err, idx) => (
                      <li key={idx} className="text-xs text-red-400">
                        • {err}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword || ""}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 pr-10 rounded-lg bg-slate-700/40 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.confirmPassword ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <ul className="mt-1 space-y-0.5">
                      {fieldErrors.confirmPassword.map((err, idx) => (
                        <li key={idx} className="text-xs text-red-400">
                          • {err}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Account Type
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg bg-slate-700/40 border text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.role ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                    }`}
                  >
                    <option value="student">Student (Find PGs)</option>
                    <option value="pg_owner">PG Owner (List PGs)</option>
                  </select>
                  {fieldErrors.role && (
                    <ul className="mt-1 space-y-0.5">
                      {fieldErrors.role.map((err, idx) => (
                        <li key={idx} className="text-xs text-red-400">
                          • {err}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 transition-all"
            >
              {loading ? "Loading..." : mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center text-sm text-slate-400">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
