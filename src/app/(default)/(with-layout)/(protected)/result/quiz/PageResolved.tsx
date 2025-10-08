/** @format */

"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { QuizResultResponseType } from "@/types/quiz";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const ResultPreview = dynamic(() => import("../ResultPreview"), {
  ssr: false,
});

const DataNotFound = dynamic(() => import("@/components/ui/DataNotFound"), {
  ssr: false,
});

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

export const PageResolved = () => {
  const searchParams = useSearchParams();
  const quiz = searchParams.get("quiz");
  const level = searchParams.get("level_slug");

  const { data, isLoading } = useGetQuery<QuizResultResponseType>({
    isPublic: false,
    url: `/quiz-result/${quiz}${level ? `?level_slug=${level}` : ""}`,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!data || data?.answers?.length === 0) {
    return (
      <DataNotFound
        title="Quiz Not Found"
        message="No result found. Please try again later."
      />
    );
  }

  return (
    <ResultPreview
      answers={data?.answers}
      previewUrl={`/result/quiz/preview?quiz=${quiz}${level ? `&level_slug=${level}` : ""}`}
    />
  );
};
