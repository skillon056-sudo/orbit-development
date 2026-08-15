/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Admins can paste any direct image URL, so we can't allowlist hosts.
    // unoptimized lets next/image render any src (no host restriction).
    unoptimized: true,
  },
  // three.js ships ESM; keep transpile safety for R3F deps
  transpilePackages: ["three"],
};

export default nextConfig;
