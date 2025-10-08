/** @format */

"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { ContestResultResponseType } from "@/types/contest";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const QuestionPreviewContainer = dynamic(
  () => import("../../QuestionPreviewContainer"),
  {
    ssr: false,
  },
);

const PageNotFound = dynamic(() => import("@/components/ui/PageNotFound"), {
  ssr: false,
});

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const contest = searchParams.get("contest");

  const { data, isLoading } = useGetQuery<ContestResultResponseType>({
    isPublic: false,
    url: `/contest-result/${contest}`,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <PageNotFound />;
  }

  return <QuestionPreviewContainer data={data} />;
}
