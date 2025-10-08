/** @format */
"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { usePageComponent } from "@/hooks/usePageComponent";
import { QuizPaginationApiResponse } from "@/types/quiz";
import { getToken } from "@/utils";
import { ArrowRightIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { Button } from "../ui/Button";

const Skeleton = dynamic(() => import("@/components/ui/QuizItemSkeleton"), {
  ssr: false,
});

const QuizItems = dynamic(
  () => import("@/app/(default)/(with-layout)/quizzes/QuizItems"),
  {
    ssr: false,
  },
);

const FirstThreeQuiz = ({ slug }: { slug: string }) => {
  const { getData } = usePageComponent({
    slug,
    sectionSlug: "three-quizzes",
  });

  const token = getToken();

  const {
    data: quizList,
    refetch,
    isLoading: isQuizListLoading,
  } = useGetQuery<QuizPaginationApiResponse>({
    isPublic: !token,
    url: "/quizzes",
    queryKey: "quizzes",
    params: {
      page: 1,
      per_page: 3,
    },
  });

  return (
    <div className="custom-container stp-30 sbp-30">
      <div className="mx-auto flex max-w-[526px] flex-col items-center justify-center text-center">
        <h2 className="heading-2">{getData("title", "Top Quizzes")}</h2>
        <p className="text-light2 pt-3 text-lg">
          {getData(
            "description",
            "Showing some top quizzes with title and description.",
          )}
        </p>
      </div>

      {/* quiz list */}

      <div className="stp-10">
        {isQuizListLoading ? (
          <Skeleton total={3} />
        ) : (
          <QuizItems quizList={quizList} refetch={refetch} />
        )}
      </div>

      <div className="mt-5 flex items-center justify-center md:mt-10">
        <Button href="/quizzes">
          View All Quizzes <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default FirstThreeQuiz;
