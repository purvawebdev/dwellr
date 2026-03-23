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
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/60 shadow-lg shadow-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button + Logo */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <button
                className="p-2.5 rounded-lg hover:bg-slate-800/80 border hover:border-slate-700 transition-all text-slate-400 hover:text-slate-200"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            )}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:shadow-indigo-500/60 group-hover:scale-110 transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:inline group-hover:from-indigo-300 group-hover:to-pink-300 transition-all">
                dwellr
              </span>
            </Link>
          </div>

          {/* Right: Nav Links + User Profile/Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2 rounded-lg transition-all font-semibold text-sm ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-indigo-300 border border-indigo-500/50"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border border-slate-700/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {mounted ? (
              isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-sm">
                      <p className="font-semibold text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user.role.replace("_", " ")}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-lg border border-slate-700/50 text-slate-100 font-semibold hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all text-sm shadow-lg shadow-indigo-500/30"
                >
                  Login
                </Link>
              )
            ) : null}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2.5 rounded-lg hover:bg-slate-800/80 transition-all text-slate-400 hover:text-slate-200"
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
        <nav className="border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg transition-all font-semibold ${
                  pathname === link.href
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {mounted && (
              <div className="border-t border-slate-700/50 pt-3 mt-3 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user.role.replace("_", " ")}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-700/50 text-slate-100 font-semibold hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="block px-4 py-2.5 rounded-lg text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
