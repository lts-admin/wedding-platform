import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ Enables proper build for deployment platforms like Amplify
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
