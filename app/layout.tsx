import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dwellr – Discover PGs Near You",
  description:
    "Find nearby PG accommodations in Pune with real user-driven insights, honest ratings, and transparent pricing. Built for students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-950 text-slate-100">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}