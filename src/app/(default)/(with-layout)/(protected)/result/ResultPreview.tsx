/** @format */

"use client";

import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import { getQueryClient } from "@/configs/query-client";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import { ContestAnswerType } from "@/types/contest";
import { QuizAnswerType } from "@/types/quiz";
import { secondToTime } from "@/utils/helper";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@phosphor-icons/react";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { memo, useMemo } from "react";

const USER_EXPLANATION = {
  80: {
    title: "Excellent",
    description: "Well done! You are mastering in this topic",
  },
  60: {
    title: "Good",
    description: "You are doing well in this topic",
  },
  30: {
    ratio: 30,
    title: "Poor",
    description: "Not bad, but you can do better",
  },
  0: {
    ratio: 0,
    title: "Very Poor",
    description: "You need to improve your knowledge",
  },
};

type Props = {
  answers: QuizAnswerType[] | ContestAnswerType[];
  previewUrl: string;
};

export const ResultPreview: React.FC<Props> = ({ answers, previewUrl }) => {
  const { user, getUser } = useAuthStore((state: AuthStore) => state);
  const { tran } = useTranslations();

  const calculateAnswerStats: any = useMemo(() => {
    const results = answers || [];
    let correct = 0;
    let wrong = 0;

    if (results.length === 0) {
      return {
        totalCorrect: 0,
        totalWrong: 0,
        total: 0,
        percentage: 0,
        totalDuration: 0,
      };
    }

    results?.forEach((item: any) => {
      if (item.is_correct) {
        correct++;
      } else {
        wrong++;
      }
    });

    const statistics = {
      explanation_title: {
        title: "",
        description: "",
      },
      totalCorrect: correct,
      totalWrong: wrong,
      total: correct + wrong,
      percentage: (correct / (correct + wrong)) * 100,
      totalDuration: results.reduce(
        (total: number, item: any) => total + item.taken_time,
        0,
      ),
    };

    if (statistics.percentage >= 80) {
      statistics.explanation_title = USER_EXPLANATION[80];
    } else if (statistics.percentage >= 60) {
      statistics.explanation_title = USER_EXPLANATION[60];
    } else if (statistics.percentage >= 30) {
      statistics.explanation_title = USER_EXPLANATION[30];
    } else {
      statistics.explanation_title = USER_EXPLANATION[0];
    }

    getQueryClient().invalidateQueries({
      queryKey: ["user-profile"],
      exact: false,
    });

    getQueryClient().invalidateQueries({
      queryKey: [["history", "quiz"]],
      exact: false,
    });
    getQueryClient().invalidateQueries({
      queryKey: [["history", "contest"]],
      exact: false,
    });

    getUser();

    return statistics;
  }, [answers, getUser]);

  return (
    <div className="pt-32">
      <div className="custom-container flex flex-col items-center justify-center text-center">
        <div className="bg-primary/60 rounded-full p-1">
          <ImageLoader
            src={user?.avatar}
            alt={user?.full_name}
            user={user}
            className="size-28 rounded-full"
            height={56}
            width={56}
          />
        </div>
        <p className="pt-4 text-2xl font-bold">{user?.full_name}</p>
        <p className="text-primary pt-6 text-6xl font-extrabold">
          {calculateAnswerStats?.percentage?.toFixed(1)}%
        </p>
        <p className="pt-2 font-medium text-black/80">
          {tran(calculateAnswerStats?.explanation_title?.title)}.{" "}
          {tran(calculateAnswerStats?.explanation_title?.description)}{" "}
        </p>
        <div className="grid w-full gap-2 pt-8 sm:grid-cols-3 sm:gap-6 lg:px-40">
          <div className="bg-primary/20 flex flex-col items-center justify-center gap-3 rounded-md p-3 sm:p-6">
            <CheckCircleIcon className="text-primary text-6xl" />
            <span className="text-3xl font-extrabold">
              {calculateAnswerStats?.totalCorrect}
            </span>
            <span className="max-sm:text-sm">{tran("Right Answer")}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-md bg-red-200 p-3 sm:p-6">
            <XCircleIcon className="text-6xl text-red-500" />
            <span className="text-3xl font-extrabold">
              {calculateAnswerStats?.totalWrong}
            </span>
            <span className="max-sm:text-sm">{tran("Wrong Answer")}</span>
          </div>
          <div className="bg-secondary/20 flex flex-col items-center justify-center gap-3 rounded-md p-3 sm:p-6">
            <ClockIcon className="text-secondary text-6xl" />
            <span className="text-3xl font-extrabold">
              {secondToTime(calculateAnswerStats?.totalDuration)}
            </span>
            <span className="max-sm:text-sm">{tran("Minutes")}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 pt-8">
          <Button href="/dashboard/profile" variant="primary-outline">
            <ArrowLeftIcon className="size-5 text-xl" />
            {tran("Profile")}
          </Button>
          <Button href={`${previewUrl}`} variant="primary-outline">
            Preview Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  ResultPreview,
  (prev, next) => prev?.answers === next?.answers,
);
