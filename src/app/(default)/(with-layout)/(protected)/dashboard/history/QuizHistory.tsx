/** @format */

import { Button } from "@/components/ui/Button";
import DataNotFound from "@/components/ui/DataNotFound";
import { useTimeTaken } from "@/hooks/useTimeTaken";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType } from "@/types";
import { UserQuizType } from "@/types/quiz";
import { cn } from "@/utils/cn";
import { ArrowRightIcon, MedalIcon } from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import React, { useCallback } from "react";

type Props = {
  userQuizzes: UserQuizType[];
};
const QuizHistory: React.FC<Props> = ({ userQuizzes }) => {
  const { tran } = useTranslations();
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);

  const timeTaken = useTimeTaken();

  const userLabelCompletedCount = useCallback((userLabel: number) => {
    return Number(userLabel);
  }, []);

  const questionCount = useCallback((questions_count: number) => {
    return Number(questions_count);
  }, []);

  const totalLabelCount = useCallback(
    (pending_label: number, completed_label: number) => {
      return Number(pending_label) + Number(completed_label);
    },
    [],
  );

  const answerCount = useCallback((answers_count: number) => {
    return Number(answers_count);
  }, []);

  const progressPercentage = useCallback(
    (
      completed_label: number,
      total_label: number,
      has_level: boolean,
      questions_count: number,
      answers_count: number,
    ) => {
      let percentage = 0;

      if (has_level) {
        percentage = Math.round((completed_label / total_label) * 100);
      } else {
        percentage = Math.round((answers_count / questions_count) * 100);
      }
      return percentage;
    },
    [],
  );

  const calculateCoins = useCallback(
    (answers_sum_score: number) => {
      return (
        answers_sum_score / appInfo?.application_info?.coins?.score_ratio?.score
      ).toPrecision(2);
    },
    [appInfo?.application_info?.coins?.score_ratio?.score],
  );

  if (!userQuizzes?.length) {
    return (
      <DataNotFound
        title={tran("No Quiz History Found")}
        message={tran("The quiz history you are looking for does not exist.")}
        imageSrc="/quiz-not-found.webp"
      />
    );
  }

  return userQuizzes.map((item) => (
    <div
      key={item?.id}
      className="border-primary/20 flex items-center justify-between gap-4 rounded-xl border p-6 max-md:flex-col"
    >
      <div className="">
        <p className="text-xl font-medium">
          {tran(item?.quiz?.translation.title)}
        </p>
        <p className="text-sm text-slate-500">
          {moment(item?.created_at).format("DD MMM, YYYY")}
        </p>
        <div className="flex flex-wrap items-center justify-start gap-2 pt-6 text-sm">
          <p className="text-slate-500">
            {tran("Time Taken")}:{" "}
            {timeTaken(item?.answers_sum_taken_time || 0)}{" "}
          </p>
          <p className="text-primary bg-primary/10 rounded-full px-3 py-0.5 capitalize">
            {tran(item?.quiz?.quiz_level_name)}
          </p>
          <div>
            <p className="text-slate-500">
              {item?.answers_sum_score} {tran("scores")}
            </p>
          </div>
          <div className="flex items-center justify-start gap-1">
            <MedalIcon />
            <p className="text-slate-500">
              {calculateCoins(item?.answers_sum_score || 0)}{" "}
              {tran("points earned")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-start gap-6">
        <div className="">
          {item?.quiz?.has_level ? (
            <p className="text-primary text-xl font-medium">
              {item?.user_level_completed}
              <span className="text-base text-slate-500">
                /
                {totalLabelCount(
                  Number(item?.user_level_completed || 0),
                  Number(item?.user_level_pending || 0),
                )}
              </span>
            </p>
          ) : (
            <p className="text-primary text-xl font-medium">
              {item.answers_count}
              <span className="text-base text-slate-500">
                /{item?.quiz?.questions_count}
              </span>
            </p>
          )}
        </div>
        <div className="">
          {item?.status === "pending" &&
            (item?.quiz?.has_level ? (
              <Button
                size="sm"
                href={`/quizzes/${item?.quiz?.translation?.slug}?tab=1`}
                className="block w-full"
                variant="primary-outline"
              >
                <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                  {tran("Go To Levels")} <ArrowRightIcon className="" />{" "}
                </span>
              </Button>
            ) : (
              <Button
                size="sm"
                href={`/play/quiz?quiz=${item?.quiz?.translation?.slug}`}
                className="block w-full"
                variant="primary-outline"
              >
                <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                  {tran("Play Now")} <ArrowRightIcon className="" />{" "}
                </span>
              </Button>
            ))}

          {item?.status === "completed" && (
            <Button
              size="sm"
              href={`/result/quiz?quiz=${item?.quiz?.translation?.slug}`}
              className="block w-full"
              variant="secondary-outline"
            >
              <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                {tran("View Result")} <ArrowRightIcon className="" />{" "}
              </span>
            </Button>
          )}

          <div className="bg-primary/20 relative mt-6 h-1.5 w-full rounded-full">
            <div
              style={{
                width: `${progressPercentage(
                  userLabelCompletedCount(item?.user_level_completed || 0),

                  totalLabelCount(
                    Number(item?.user_level_completed || 0),
                    Number(item?.user_level_pending || 0),
                  ),
                  item?.quiz?.has_level,

                  questionCount(item?.quiz?.questions_count || 0),

                  answerCount(item?.answers_count || 0),
                )}%`,
              }}
              className={cn(
                "bg-primary absolute top-0 left-0 h-1.5 rounded-full",

                `${item.status === "completed" ? "w-full" : ""}`,
              )}
            ></div>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default QuizHistory;
