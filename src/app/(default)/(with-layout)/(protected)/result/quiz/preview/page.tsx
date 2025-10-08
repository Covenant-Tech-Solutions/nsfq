/** @format */

"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { QuizResultResponseType } from "@/types/quiz";
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
  const quiz = searchParams.get("quiz");
  const level = searchParams.get("level_slug");

  const { data, isLoading } = useGetQuery<QuizResultResponseType>({
    isPublic: false,
    url: `/quiz-result/${quiz}${level ? `?level_slug=${level}` : ""}`,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <PageNotFound
        title="Preview data not found!"
        message="The preview data you are looking for does not exist."
      />
    );
  }

  return <QuestionPreviewContainer data={data} />;
}
