/**
 * @format
 * @type {import('next').NextConfig}
 */

import path from "path";
import { fileURLToPath } from "url";
import { NextConfig } from "next";
import { parseServerUrl } from "@/utils/helper";
import { RemotePattern } from "next/dist/shared/lib/image-config";
import { SERVER_URL } from "@/configs";

// Constants
const DIRNAME: string = path.dirname(fileURLToPath(import.meta.url));

// Trusted image domains configuration
const TRUSTED_IMAGE_DOMAINS: string[] = [
  SERVER_URL,
  "https://eu.ui-avatars.com/",
];

// Configuration builders
const buildRemotePatterns = (urls: string[]): RemotePattern[] => {
  try {
    return urls.map((url) => {
      const { protocol, hostname, port, prefix } = parseServerUrl(url);

      // Ensure valid protocol
      if (protocol !== "http" && protocol !== "https") {
        throw new Error(`Invalid protocol '${protocol}' in URL: ${url}`);
      }

      return {
        protocol, // must be "http" or "https"
        hostname,
        port: port || undefined,
        pathname: prefix || "/**", // optional, default fallback pattern
      };
    });
  } catch (error: any) {
    console.error("Error building remote patterns:", error);
    throw new Error(`Failed to build remote patterns: ${error.message}`);
  }
};

const buildRewrites = () => {
  if (!SERVER_URL) {
    throw new Error("SERVER_URL is not defined");
  }
  const routes = [
    {
      source: "/uploads/:path*",
      destination: `${SERVER_URL}/uploads/:path*`,
    },
    {
      source: "/storage/:path*",
      destination: `${SERVER_URL}/storage/:path*`,
    },
    {
      source: "/assets/:path*",
      destination: `${SERVER_URL}/assets/:path*`,
    },
    {
      source: "/frontend-uploads/:path*",
      destination: `${SERVER_URL}/frontend-uploads/:path*`,
    },
  ];

  return async () => routes;
};

// Main configuration
const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },

  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: buildRemotePatterns(TRUSTED_IMAGE_DOMAINS),
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  sassOptions: {
    includePaths: [path.join(DIRNAME, "styles")],
    silenceDeprecations: ["legacy-js-api"],
  },

  rewrites: SERVER_URL ? buildRewrites() : undefined,

  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  ...(process.env.NODE_ENV === "production" && {
    productionBrowserSourceMaps: false,
  }),
};

// Final validation
const validateConfig = (config: NextConfig) => {
  if (!config?.images?.remotePatterns?.length) {
    throw new Error("Remote patterns configuration is required");
  }
  return config;
};

export default validateConfig(nextConfig);
