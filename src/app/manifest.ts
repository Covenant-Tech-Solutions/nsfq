import { getFetchInstance } from "@/configs/getFetchInstance";
import { PWAResponseType, PWAType } from "@/types";
import type { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let pwaData: PWAType | null = null;

  try {
    const response: PWAResponseType = await getFetchInstance({
      url: "/pwa-manifest",
    });
    pwaData = response?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch PWA manifest:", error);
  }

  // Default icons if API did not provide any
  const defaultIcons = [
    {
      src: "/fb-logo.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/fb-logo.png",
      sizes: "512x512",
      type: "image/png",
    },
  ];

  return {
    name: pwaData?.title || "NextPWA",
    short_name: pwaData?.title || "NextPWA",
    description: pwaData?.description || "",
    start_url: "/",
    display: "standalone",
    background_color: pwaData?.background_color || "#ffffff",
    theme_color: pwaData?.theme_color || "#000000",
    icons:
      Array.isArray(pwaData?.icons) && pwaData.icons.length > 0
        ? pwaData.icons
        : defaultIcons,
  };
}
