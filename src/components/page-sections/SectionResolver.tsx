/** @format */
"use client";
import { PageSectionType } from "@/types";
import React, { lazy, memo } from "react";
import Default from "./Default";

const components: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  "home-hero": lazy(() => import("@/components/page-sections/HomeHero")),
  "how-it-works": lazy(() => import("@/components/page-sections/HowItWorks")),
  "upcoming-contests": lazy(
    () => import("@/components/page-sections/FirstThreeContest"),
  ),
  "three-quizzes": lazy(
    () => import("@/components/page-sections/FirstThreeQuiz"),
  ),
  "the-journey": lazy(() => import("@/components/page-sections/Journey")),
  "faq-section": lazy(() => import("@/components/page-sections/FaqSection")),
  testimonials: lazy(() => import("@/components/page-sections/Testimonials")),
  "top-players": lazy(() => import("@/components/page-sections/TopPlayers")),
  "contact-form": lazy(() => import("@/components/page-sections/ContactForm")),
  "contact-us": lazy(() => import("@/components/page-sections/ContactUs")),
  "unique-quiz-features": lazy(
    () => import("@/components/page-sections/UniqueQuizFeatures"),
  ),
  "counter-section": lazy(
    () => import("@/components/page-sections/CounterSection"),
  ),
};

interface SectionResolverProps {
  pageSlug: string;
  section: PageSectionType;
}

const SectionResolver: React.FC<SectionResolverProps> = ({
  pageSlug,
  section,
}) => {
  const Component = components[section?.slug];

  if (!Component) {
    return <Default section={section?.content} />;
  }

  return <Component slug={pageSlug} />;
};

export default memo(SectionResolver, (prev, next) => {
  return prev?.section?.slug === next?.section?.slug;
});
