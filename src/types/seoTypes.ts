export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface OpenGraph {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  siteName?: string;
  locale?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageHeight?: string;
}

export interface Twitter {
  card?: string;
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface Verification {
  google?: string;
  other?: Record<string, string>;
}

export interface Favicon {
  rel: string;
  type?: string;
  href: string;
  sizes?: string;
}

interface StructuredData {
  script: {
    type: string;
    content: string;
  };
}

export interface SEOData {
  app_url: string;
  title: string;
  description: string;
  keywords?: string;
  image?: string; // Root-level image
  alternates?: {
    canonical?: string;
  };
  canonical_link?: string; // Root-level canonical URL
  author?: string;
  robots?: string;
  openGraph?: OpenGraph;
  twitter?: Twitter;
  verification?: Verification;
  meta?: MetaTag[];
  favicon?: Favicon[]; // Added favicon support
  structuredData?: StructuredData; // Added structured data support
}

export interface SeoPageSetupResponse {
  statusCode: number;
  data: SEOData;
}
