import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/cloze-generator": [
      // IMPORTANT: avoid node_modules/nodewordfreq (symlink under pnpm)
      "node_modules/.pnpm/nodewordfreq@*/node_modules/nodewordfreq/**",

      // your local file
      "data/dictionary.json",
    ],
  },

  // For now, REMOVE serverExternalPackages if you added it
  // serverExternalPackages: ["nodewordfreq"],
};

export default nextConfig;
