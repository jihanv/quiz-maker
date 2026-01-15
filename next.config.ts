import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1) Make sure Vercel bundles the extra data files your server code reads at runtime
  //    (nodewordfreq wordlists + your local dictionary.json)
  outputFileTracingIncludes: {
    "/api/cloze-generator": [
      "node_modules/nodewordfreq/**/*",
      "data/dictionary.json",
    ],
  },

  // 2) Optional: tells Next not to try to bundle this package (helps with Node-specific deps)
  serverExternalPackages: ["nodewordfreq"],
};

export default nextConfig;
