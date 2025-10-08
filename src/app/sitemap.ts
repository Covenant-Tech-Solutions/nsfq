import { getAppSitemap } from "@/hooks/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const data = await getAppSitemap();
    if (!data || !Array.isArray(data)) {
      console.warn("No valid sitemap data found");
      return [];
    }

    const sitemaps = data.map((item) => {
      return {
        url: item?.loc,
        lastModified: item?.lastmod || new Date(),
        changeFrequency: item?.changefreq || "monthly",
        priority: item?.priority || 0.5,
      };
    });

    return sitemaps;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
