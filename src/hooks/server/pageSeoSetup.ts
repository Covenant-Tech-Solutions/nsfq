/** @format */

import { SERVER_URL } from "@/configs";
import { getFetchInstance } from "@/configs/getFetchInstance";
import {
  Favicon,
  MetaTag,
  SEOData,
  SeoPageSetupResponse,
} from "@/types/seoTypes";

const APPLICATION_BASE_URL: string =
  (process.env.NEXT_PUBLIC_BASE_URL as string) || "http://localhost:3000";

/**
 * Fetches and processes SEO data for a given page.
 */
export const setPageMetaData = async ({
  slug = "/",
  type = "",
}: {
  slug?: string;
  type?: string;
}) => {
  let url = `/page-seo/?slug=${slug}`;
  if (type) {
    url += `&type=${type}`;
  }
  let seoData: SEOData | null = null;
  try {
    const response: SeoPageSetupResponse = await getFetchInstance({
      url,
    });
    seoData = response?.data;
  } catch (error) {
    console.error(error);
  }

  // Remove structuredData from seoData object, as it's not needed
  if (!seoData) return {} as SEOData;

  delete seoData?.structuredData;
  return {
    metadataBase: seoData?.app_url
      ? new URL(seoData?.app_url)
      : new URL(APPLICATION_BASE_URL),

    ...seoData,
    image: seoData?.image ? SERVER_URL + seoData.image : "",
    openGraph: {
      ...seoData.openGraph,
      image: seoData?.openGraph?.image
        ? SERVER_URL + seoData.openGraph.image
        : "",
      url: !seoData?.openGraph?.url
        ? seoData?.app_url
        : seoData?.openGraph?.url,
    },
    twitter: {
      ...seoData.twitter,
      image: seoData?.twitter?.image ? SERVER_URL + seoData.twitter.image : "",
    },
    favicon: faviconFormat(seoData?.favicon as Favicon[]),
    ...extractMetaData(seoData?.meta as MetaTag[]),
  };
};

/**
 * Extracts meta data for Google verification and other meta tags.
 */
const extractMetaData = (meta: MetaTag[]) => {
  if (!meta?.length) return {} as Record<string, string>;
  const googleMeta =
    meta.find((item) => item?.name === "google-site-verification")?.content ||
    "";

  const otherMeta = meta
    .filter((item) => item?.name !== "google-site-verification")
    .reduce(
      (acc, item) => {
        const key = item?.name || item?.property;
        if (key) {
          acc[key] = item?.content;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

  return { googleMeta, ...otherMeta };
};

const faviconFormat = (favicon: Favicon[]): Favicon[] => {
  return favicon?.map((item) => ({
    ...item,
    href: SERVER_URL + item.href,
  }));
};
