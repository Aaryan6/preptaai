import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@deepgram/sdk"],
  images: {
    remotePatterns: [
      {
        hostname: "yhdoxqjernsufwguhtyd.supabase.co",
      },
    ],
  },
};

export default nextConfig;
