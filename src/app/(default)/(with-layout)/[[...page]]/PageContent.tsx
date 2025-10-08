/** @format */
"use client";
import Breadcrumb from "@/components/partials/Breadcrumb";
import DataNotFound from "@/components/ui/DataNotFound";
import { usePageComponent } from "@/hooks/usePageComponent";
import dynamic from "next/dynamic";
import React, { memo, useMemo } from "react";

const SectionResolver = dynamic(
  () => import("@/components/page-sections/SectionResolver"),
  {
    ssr: false,
  },
);

const PageContent = ({ page }: { page: string }) => {
  const { sections, pageTitle } = usePageComponent({ slug: page });

  const sectionResolved = useMemo(() => {
    if (!sections || sections.length === 0) {
      return null;
    }
    return sections.map((section: any, index: number) => {
      return <SectionResolver key={index} pageSlug={page} section={section} />;
    });
  }, [sections, page]);

  if (!sectionResolved) {
    return (
      <div className="py-10">
        <DataNotFound
          title="Page Not Found"
          message="The page you are looking for does not exist."
          redirect="/"
        />
      </div>
    );
  }

  return (
    <React.Fragment>
      {page !== "/" && pageTitle && <Breadcrumb title={pageTitle} />}
      {sectionResolved}
    </React.Fragment>
  );
};

export default memo(PageContent, (prev, next) => prev?.page === next?.page);
