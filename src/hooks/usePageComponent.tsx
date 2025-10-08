/** @format */
"use client";

import { usePage } from "@/providers/PageProvider";
import { useTranslations } from "@/providers/TranslationProviders";
import { PageSectionType, PageType } from "@/types";
import { placeDynamicText } from "@/utils/helper";
import { useCallback, useMemo } from "react";

interface Page {
  slug: string;
  sectionSlug?: string;
}
export const usePageComponent = ({ slug, sectionSlug }: Page) => {
  const { pages }: { pages: PageType[] } = usePage();
  const { tran } = useTranslations();
  const page = useMemo(() => {
    return pages?.find((page: PageType) => page.slug === slug);
  }, [pages, slug]);

  const pageContents: any = useMemo(() => {
    if (sectionSlug) {
      const pageSections = (page?.sections as PageSectionType[]) || [];
      const section = pageSections?.find(
        (section: PageSectionType) => section.slug === sectionSlug,
      );
      return section?.content;
    }
    return {} as PageSectionType;
  }, [page, sectionSlug]);

  const getData = useCallback(
    (key: string, defaultText?: any) => {
      const content = placeDynamicText(pageContents, key, defaultText);
      if (content && typeof content === "string") {
        return tran(content);
      }
      return content;
    },
    [pageContents, tran],
  );

  return {
    getData,
    tran,
    sections: page?.sections,
    pageTitle: page?.title,
  };
};
