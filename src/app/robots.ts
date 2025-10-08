import { API_BASE_URL } from "@/configs";
import { getAppRobots } from "@/hooks/server";

export default async function robots() {
  try {
    const data = await getAppRobots();
    if (!data) {
      return {
        rules: [
          {
            userAgent: "*",
            allow: "/",
          },
        ],
        sitemap: `${API_BASE_URL}/sitemap.xml`,
      };
    }

    if (!data?.rules) {
      return {
        rules: [
          {
            userAgent: "*",
            allow: "/",
          },
        ],
        sitemap: `${API_BASE_URL}/sitemap.xml`,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching robots data:", error);
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
      sitemap: `${API_BASE_URL}/sitemap.xml`,
    };
  }
}
