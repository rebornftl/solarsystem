/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "apod.nasa.gov" },
      { protocol: "https", hostname: "epic.gsfc.nasa.gov" },
      { protocol: "https", hostname: "mars.nasa.gov" },
      { protocol: "https", hostname: "mars.jpl.nasa.gov" },
      { protocol: "https", hostname: "images-assets.nasa.gov" },
      { protocol: "https", hostname: "images-api.nasa.gov" },
      { protocol: "https", hostname: "www.nasa.gov" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.nasa.gov" },
    ],
  },
  experimental: {
    // React Three Fiber ships as ESM; keep transpile pipeline predictable.
    optimizePackageImports: ["@react-three/drei", "framer-motion"],
  },
};

export default nextConfig;
