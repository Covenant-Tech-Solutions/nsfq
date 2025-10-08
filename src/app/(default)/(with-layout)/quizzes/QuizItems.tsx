/** @format */
"use client";
import { QuizPaginationApiResponse } from "@/types/quiz";
import dynamic from "next/dynamic";
import React, { memo, useMemo } from "react";

const QuizListItem = dynamic(() => import("./QuizListItem"), {
  ssr: false,
});

const DataNotFound = dynamic(() => import("@/components/ui/DataNotFound"), {
  ssr: false,
});

type QuizItemsProps = {
  quizList: QuizPaginationApiResponse | undefined;
  refetch: () => void;
};

const QuizItems: React.FC<QuizItemsProps> = ({ quizList, refetch }) => {
  const quizzes = useMemo(() => {
    return quizList?.data;
  }, [quizList]);

  return quizzes?.length ? (
    <div className="grid grid-cols-12 gap-6 overflow-hidden pt-8">
      {quizzes.map((quiz) => (
        <div className="col-span-12 md:col-span-6 xl:col-span-4" key={quiz?.id}>
          <QuizListItem quiz={quiz} refetch={refetch} />
        </div>
      ))}
    </div>
  ) : (
    <DataNotFound
      title="Quizzes Not Found"
      message="No quizzes found. Please try again later."
      imageSize="lg"
      imageSrc="/quiz-not-found.webp"
    />
  );
};

export default memo(
  QuizItems,
  (prev, next) => prev?.quizList?.data === next?.quizList?.data,
);
