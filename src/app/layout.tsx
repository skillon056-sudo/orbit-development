import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://orbitdev.example"),
  title: {
    default: "Orbit Development — Building Digital Worlds",
    template: "%s · Orbit Development",
  },
  description:
    "Premium software development studio. We build websites, mobile apps and custom software with a futuristic, cinematic edge.",
  keywords: ["software development", "website development", "app development", "custom software", "Orbit Development"],
  openGraph: {
    title: "Orbit Development — Building Digital Worlds",
    description: "Premium websites, apps and custom software.",
    type: "website",
    siteName: "Orbit Development",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-body antialiased">
        {/* fixed cosmic backdrop (solid base under the 3D scene) */}
        <div className="pointer-events-none fixed inset-0 -z-50 bg-ink bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(58,43,140,0.25),transparent_60%)]" />
        {children}
      </body>
    </html>
  );
}
