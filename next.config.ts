import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["nodewordfreq", "nodejieba"],
  outputFileTracingIncludes: {
    "/api/cloze-generator": [
      "./node_modules/nodewordfreq/**",
      "./node_modules/nodejieba/**",
      "./data/dictionary.json",
    ],
  },
};

export default nextConfig;
