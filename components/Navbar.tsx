"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout, isAuthenticated, isHydrated } = useAuth();

  // Ensure hydration matches by not rendering auth UI until hydrated
  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === "/";

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "About" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileOpen(false);
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button + Logo */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <button
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
                dwellr
              </span>
            </Link>
          </div>

          {/* Center/Right: Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  pathname === link.href
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: User Profile & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {mounted ? (
              isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-sm">
                      <p className="font-medium text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-100 font-medium hover:bg-slate-800 transition-all text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all text-sm"
                >
                  Login
                </Link>
              )
            ) : null}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`w-6 h-0.5 bg-slate-100 rounded transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-slate-100 rounded transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-slate-100 rounded transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg transition-colors font-medium ${
                  pathname === link.href
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-700 pt-2 mt-2">
              {mounted ? (
                isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 mb-2">
                      <p className="font-medium text-slate-100 text-sm">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 text-slate-100 font-medium hover:bg-slate-800 transition-all text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="block px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                )
              ) : null}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
