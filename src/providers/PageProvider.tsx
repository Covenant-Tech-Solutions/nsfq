/** @format */

"use client";
import { PageType } from "@/types";
import React, { createContext, useContext, useMemo } from "react";

const PageContext = createContext({ pages: [] as PageType[] });

interface PageProviderTypes {
  children: React.ReactNode;
  pagesData: PageType[];
}

export const PageProvider = ({ children, pagesData }: PageProviderTypes) => {
  const pages = useMemo(() => ({ pages: pagesData }), [pagesData]);
  return <PageContext.Provider value={pages}>{children}</PageContext.Provider>;
};

// Custom hook to use the translation context
export const usePage = () => {
  return useContext(PageContext) as { pages: PageType[] };
};
