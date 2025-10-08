/** @format */

import { Button } from "@/components/ui/Button";
import { QuizType } from "@/types/quiz";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";

type PlayButtonsProps = {
  quiz: QuizType;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  tran: (key: string) => string;
};

const PlayButtons: React.FC<PlayButtonsProps> = ({
  quiz: quizDetails,
  setShowModal,

  tran,
}) => {
  const status = quizDetails?.taken_status || "";
  const hasLabel = quizDetails?.has_level;
  const slug = quizDetails?.translation.slug;
  const commonClass =
    "btn text-white w-full flex justify-center items-center gap-2";

  if (["pending", "in_progress"].includes(status)) {
    return hasLabel ? (
      <Button href={`/quizzes/${slug}?tab=1`} className={commonClass}>
        {tran("Go To Levels")}
      </Button>
    ) : (
      <Button
        href={`/play/quiz?quiz=${slug}`}
        className="flex w-full items-center justify-center gap-1"
      >
        {tran("Start Playing")}
        <ArrowRightIcon />
      </Button>
    );
  }

  if (status === "completed") {
    return hasLabel ? (
      <Button className={commonClass} disabled>
        {tran("You have completed All Levels")}
      </Button>
    ) : (
      <Button href={`/result/quiz?quiz=${slug}`} className={commonClass}>
        {tran("View Result")}
        <ArrowRightIcon />
      </Button>
    );
  }

  return (
    <Button onClick={() => setShowModal(true)} className={commonClass}>
      {tran("Start Quiz")}
      <ArrowRightIcon />
    </Button>
  );
};

export default PlayButtons;
