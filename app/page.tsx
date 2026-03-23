"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-slate-950 to-purple-600/10 opacity-60" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-8 hover:border-indigo-400/50 transition-colors">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300">Open-source PG discovery</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PG Stay
            </span>
            in Pune
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover nearby PG accommodations with real ratings, verified amenities,
            and transparent pricing — all powered by OpenStreetMap.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
              </svg>
              Explore PGs Near You
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-slate-700 text-slate-100 font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 pts-8 justify-center max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-400 mb-2">18+</div>
              <div className="text-sm text-slate-400">PGs Listed</div>
            </div>
            <div className="hidden md:flex h-16 w-px bg-slate-700 mx-auto" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">15</div>
              <div className="text-sm text-slate-400">Areas Covered</div>
            </div>
            <div className="hidden md:flex h-16 w-px bg-slate-700 mx-auto" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">100%</div>
              <div className="text-sm text-slate-400">Free & Open</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why <span className="text-indigo-400">Dwellr</span>?
          </h2>
          <p className="text-center text-slate-400 mb-16 text-lg max-w-2xl mx-auto">
            Built for students, designed for simplicity
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all hover:bg-slate-800/80 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-shadow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Location-Based Discovery</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatically detects your location and shows PGs within 5km. No manual searching needed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:bg-slate-800/80 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real Ratings & Reviews</h3>
              <p className="text-slate-400 leading-relaxed">
                Transparent ratings from real students. Know what you&apos;re getting before you commit.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:bg-slate-800/80 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-shadow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Free & Open Source</h3>
              <p className="text-slate-400 leading-relaxed">
                Built on OpenStreetMap and Leaflet. No API keys, no paywalls, no tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-indigo-500/30">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Allow Location</h3>
              <p className="text-slate-400">
                Grant location access or pick your area from the Pune dropdown
              </p>
              {/* Connector */}
              <div className="hidden md:flex w-12 h-12 items-center justify-center mt-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden md:inline text-indigo-600 rotate-90">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-purple-500/30">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse PGs</h3>
              <p className="text-slate-400">
                View nearby PGs on the map with rent, ratings, and amenities
              </p>
              {/* Connector */}
              <div className="hidden md:flex w-12 h-12 items-center justify-center mt-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden md:inline text-purple-600 rotate-90">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-emerald-500/30">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect</h3>
              <p className="text-slate-400">
                Get details, compare options, and find your ideal stay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-y border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to find your next PG?</h2>
          <p className="text-lg text-slate-400 mb-10">Start exploring PGs near you in seconds.</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 mb-4">© 2026 Dwellr · Built for students, by students</p>
          <p className="text-slate-400 mb-4">
            Created by Purva Palankar ·{" "}
            <a
              href="https://github.com/purvawebdev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              GitHub
            </a>{" "}
            ·{" "}
            <a
              href="https://www.linkedin.com/in/purvapalankar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              LinkedIn
            </a>
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              About
            </Link>
            <span>·</span>
            <Link href="/explore" className="hover:text-slate-200 transition-colors">
              Explore
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}