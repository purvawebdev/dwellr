import Link from "next/link";

export default function AboutPage() {
  const techStack = [
    { name: "Next.js", desc: "React framework with App Router", icon: "⚡" },
    { name: "TypeScript", desc: "Type-safe development", icon: "🔷" },
    { name: "MongoDB", desc: "Geospatial database with 2dsphere indexing", icon: "🍃" },
    { name: "Leaflet", desc: "Open-source map rendering", icon: "🗺️" },
    { name: "OpenStreetMap", desc: "Free community-driven map tiles", icon: "🌍" },
    { name: "TanStack Query", desc: "Smart data fetching & caching", icon: "⚙️" },
    { name: "Tailwind CSS", desc: "Utility-first styling", icon: "🎨" },
    { name: "Zod", desc: "Runtime validation", icon: "✓" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Transparency First",
      desc: "Every listing shows real prices, real amenities, and real ratings from fellow students.",
    },
    {
      icon: "🗺️",
      title: "Open Data",
      desc: "Built on OpenStreetMap — community-maintained, free forever, and no vendor lock-in.",
    },
    {
      icon: "🔒",
      title: "Privacy Respected",
      desc: "Your location data stays on your device. We never track, store, or sell your position.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-8">
            <span className="text-sm font-medium text-indigo-300">Our Mission</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Making PG discovery
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              simple & transparent
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dwellr helps students in Pune find the right PG accommodation with
            real data, honest ratings, and zero paywalls. No hidden fees, no
            sponsored listings — just genuine information to help you make the
            right choice.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Built With <span className="text-indigo-400">Modern Tech</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{tech.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                <p className="text-sm text-slate-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-y border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Want to contribute?</h2>
          <p className="text-lg text-slate-400 mb-10">
            Dwellr is open source. Help us make PG discovery better for everyone.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1"
          >
            Start Exploring
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
            <Link href="/" className="hover:text-slate-200 transition-colors">
              Home
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
