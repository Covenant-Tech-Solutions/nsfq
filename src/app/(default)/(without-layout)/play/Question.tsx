/** @format */

"use client";

import { Button } from "@/components/ui/Button";
import { QuestionCountDownTimer } from "@/components/ui/QuestionCountDownTimer";
import { getQueryClient } from "@/configs/query-client";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestQuestionType } from "@/types/contest";
import { QuizQuestionType } from "@/types/quiz";
import confetti from "canvas-confetti";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const Explanation = dynamic(() => import("./Explanation"), {
  ssr: false,
});

const HintTooltip = dynamic(() => import("./HintTooltip"), {
  ssr: false,
});

const Options = dynamic(() => import("./Options"), {
  ssr: false,
});

const QuestionLoader = dynamic(() => import("./QuestionLoader"), {
  ssr: false,
});

export interface OptionsType {
  label: string;
  value: string;
}

export type QuestionPageProps = {
  playType: "quiz" | "contest";
  questions: QuizQuestionType | ContestQuestionType;
  questionOrder?: number;
  totalQuestion: number;
  refetch: () => void;
  setQuestionTimeOut: (updatedTime?: number) => void;
  getQuestionTimeOut: () => number;
  removeQuestionTimeOut: (order?: number) => void;
  isFetching?: boolean;
};

export default function QuestionPage({
  playType,
  questions,
  questionOrder = 1,
  totalQuestion,
  refetch,
  setQuestionTimeOut,
  getQuestionTimeOut,
  removeQuestionTimeOut,
  isFetching,
}: QuestionPageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
  const timeLimit = (questions?.time_limit || 0) * 60;
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizName = searchParams.get(playType);
  const level = searchParams.get("level_slug");
  const isMultipleAns = useMemo(
    () =>
      ["fill_in_the_blank", "multiple_choice"].includes(
        questions?.question_type || "",
      ),
    [questions],
  );
  const [isAlreadyAnswered, setIsAlreadyAnswered] = useState(false);

  const questionOrderNumber = questionOrder && Number(questionOrder);
  const { tran } = useTranslations();

  const { mutate, isLoading } = useQueryMutation({
    isPublic: false,
    url: `/${playType}-answer/${quizName}/${questions?.translation?.slug}${level ? `?level_slug=${level}` : ""}`,
  });

  useEffect(() => {
    setSelectedAnswer([]);
    setCorrectAnswer([]);
  }, [questionOrderNumber]);

  const getTimeTaken = useCallback(() => {
    const stored = getQuestionTimeOut();
    const totalTime = (questions?.time_limit || 0) * 60;
    const timeUsed = stored ? totalTime - stored : totalTime;
    return timeUsed;
  }, [getQuestionTimeOut, questions]);

  const handleSkip = () => {
    removeQuestionTimeOut(questionOrderNumber);
    if (questionOrderNumber >= totalQuestion) {
      router.push(
        `/result/${playType}?${playType}=${quizName}${level ? `&&level_slug=${level}` : ""}`,
      );
    }
  };

  const submitAnswer = useCallback(
    (answers: string[], e: React.MouseEvent<HTMLButtonElement>) => {
      if (!answers.length) {
        toast.error(tran("Please select at least one answer."));
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      mutate(
        { answers, taken_time: getTimeTaken() },
        {
          onSuccess: (res) => {
            const data = res?.data?.data;

            setCorrectAnswer(data?.correct_answers || []);

            getQueryClient().invalidateQueries({
              queryKey: [["quiz-details", quizName]],
              exact: false,
            });
            setIsAlreadyAnswered(true);

            localStorage.removeItem(questions?.translation?.slug || "");

            if (data?.is_correct) {
              confetti({
                origin: {
                  x: x / window.innerWidth,
                  y: y / window.innerHeight,
                },
              });
              // Automatically continue to next question after 2 seconds
              setTimeout(() => {
                if (questionOrderNumber < totalQuestion) {
                  refetch();
                  localStorage.removeItem(questions?.translation?.slug || "");
                  setIsAlreadyAnswered(false);
                } else {
                  showResult();
                }
              }, 2000);
            } else {
              toast.error(data?.message);
            }
          },
        },
      );
    },
    [mutate, tran, quizName, getTimeTaken, questions?.translation?.slug, questionOrderNumber, totalQuestion, refetch],
  );

  const renderQuestionText = (text: string | undefined) => {
    if (!text) return null;
    const parts = text.split(/\{.*?\}/g);
    const matches = text.match(/\{.*?\}/g) || [];
    return parts.flatMap((part, index) => [
      <span key={`part-${index}`}>{part}</span>,
      index < matches.length ? (
        <span
          key={`line-${index}`}
          className="border-primary mx-1 -mb-3 inline-block h-px w-20 border-b align-middle"
        ></span>
      ) : null,
    ]);
  };

  const handleOnCompleteTimer = () => {
    mutate(
      { answers: [], taken_time: questions?.time_limit },
      {
        onSuccess: (res) => {
          const data = res?.data?.data;
          setCorrectAnswer(data?.correct_answers || []);
          refetch();
          setTimeout(() => handleSkip(), 1500);
        },
        onError: (response: any) => {
          toast.error(response?.data?.data?.message);
        },
      },
    );
  };

  const showResult = useCallback(() => {
    if (questions?.translation?.slug) {
      localStorage.removeItem(questions.translation.slug);
    }
    router.push(
      `/result/${playType}?${playType}=${quizName}${level ? `&level_slug=${level}` : ""}`,
    );
  }, [questions?.translation?.slug, playType, quizName, level, router]);

  const questionButton = useMemo(() => {
    if (isAlreadyAnswered && questionOrderNumber == totalQuestion) {
      return <Button onClick={showResult}>Result</Button>;
    }

    return (
      <div className="flex items-center gap-3">
        {!isAlreadyAnswered && (
          <Button
            loading={isLoading}
            onClick={(e) => {
              submitAnswer(selectedAnswer, e);
            }}
            className="w-full w-50 sm:w-auto"
          >
            Submit
          </Button>
        )}

        {isAlreadyAnswered && !isLoading && (
          <Button
            onClick={() => {
              refetch();
              localStorage.removeItem(questions?.translation?.slug || "");
              setIsAlreadyAnswered(false);
            }}
            variant="secondary"
            className="w-full w-50 sm:w-auto text-black"
          >
            Continue
          </Button>
        )}
      </div>
    );
  }, [
    isAlreadyAnswered,
    questionOrderNumber,
    totalQuestion,
    refetch,
    isLoading,
    submitAnswer,
    selectedAnswer,
    questions,
    showResult,
  ]);

  return (
    <div className="flex w-full flex-col pt-4 sm:px-6 lg:px-20">
      {isFetching && totalQuestion != questionOrder ? (
        <QuestionLoader />
      ) : (
        <>
          <QuestionCountDownTimer
              initialDuration={timeLimit}
              size={60}
              progressColor="var(--primary)"
              questionOrder={questionOrder}
              onComplete={handleOnCompleteTimer}
              setQuestionTimeOut={setQuestionTimeOut}
              getQuestionTimeOut={getQuestionTimeOut}
              removeQuestionTimeOut={removeQuestionTimeOut}
              isAlreadyAnswered={isAlreadyAnswered}
            />
          <h4 className="heading-4 text-center">
            {renderQuestionText(questions?.translation?.question_text)}
          </h4>

          <div className="relative flex w-full items-center justify-center gap-6 py-6 max-lg:flex-col lg:py-10 2xl:gap-12">
            <Explanation
              explanation_type={questions?.explanation_type}
              translation={questions?.translation}
            />
            <Options
              correctAnswer={correctAnswer}
              options={questions?.options}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              isAlreadyAnswered={isAlreadyAnswered}
              isMultipleAns={isMultipleAns}
            />
          </div>

          <div className="border-dark5 flex w-full flex-wrap items-center justify-between gap-3 border-t pt-4 sm:gap-6">
          <HintTooltip hint={questions?.translation?.hints} />
            <div className="flex flex-wrap gap-3">             

              {questionButton}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
