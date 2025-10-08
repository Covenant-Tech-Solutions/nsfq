import { getFetchInstance } from "@/configs/getFetchInstance";
import { SEOData, SeoPageSetupResponse } from "@/types/seoTypes";
import { Remarkable } from "remarkable";

const StructuredData = async () => {
  const md = new Remarkable();
  const response: SeoPageSetupResponse = await getFetchInstance({
    url: `/page-seo`,
  });

  const seoData: SEOData = response?.data;

  if (!seoData?.structuredData?.script?.content) {
    return <></>;
  }

  const type = seoData.structuredData.script.type || "application/ld+json";
  const content = md.render(seoData.structuredData.script.content);

  return <script type={type} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default StructuredData;
