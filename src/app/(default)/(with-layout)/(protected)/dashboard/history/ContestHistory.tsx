/** @format */

import DataNotFound from "@/components/ui/DataNotFound";
import { useTimeTaken } from "@/hooks/useTimeTaken";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType } from "@/types";
import { ParticipantType } from "@/types/contest";
import { cn } from "@/utils/cn";
import { MedalIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import Link from "next/link";
import React, { useCallback } from "react";
type Props = {
  participants: ParticipantType[];
};
const ContestHistory: React.FC<Props> = ({ participants }) => {
  const { tran } = useTranslations();
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);
  const progressPercentage = useCallback(
    (questions_count: number, answers_count: number) => {
      return Math.round((answers_count / questions_count) * 100);
    },
    [],
  );

  const timeTaken = useTimeTaken();

  const calculateCoins = useCallback(
    (answers_sum_score: number) => {
      return (
        answers_sum_score / appInfo?.application_info?.coins?.score_ratio?.score
      ).toPrecision(2);
    },
    [appInfo?.application_info?.coins?.score_ratio?.score],
  );
  if (!participants?.length) {
    return (
      <DataNotFound
        title={tran("No Contest History Found")}
        message={tran(
          "The contest history you are looking for does not exist.",
        )}
        imageSrc="/quiz-not-found.webp"
      />
    );
  }

  return participants.map((item) => (
    <div
      key={item?.id}
      className="border-primary/20 flex items-center justify-between gap-4 rounded-xl border p-6 max-md:flex-col"
    >
      <div className="">
        <p className="text-xl font-medium">
          {tran(item?.contest?.translation?.title || "")}
        </p>
        <p className="text-sm text-slate-500">
          {moment(item?.created_at).format("DD MMM, YYYY")}
        </p>
        <div className="flex flex-wrap items-center justify-start gap-2 pt-6 text-sm">
          <p className="text-slate-500">
            {timeTaken(item.time_taken)} {tran("seconds")}
          </p>
          <p className="text-primary bg-primary/10 rounded-full px-3 py-0.5 capitalize">
            {tran(item?.contest?.contest_label_name || "")}
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
        <div>
          <p className="text-primary text-xl font-medium">
            {item?.answers_count}
            <span className="text-base text-slate-500">
              /{item?.contest?.questions_count}
            </span>
          </p>
        </div>
        <div>
          <Link
            href={`/contests/${item?.contest?.translation?.slug}`}
            className="text-primary flex items-center justify-start gap-1 font-medium"
          >
            <PlayIcon /> {tran("Details")}
          </Link>
          <div className="bg-primary/20 relative mt-6 h-1.5 w-full rounded-full">
            <div
              className={cn(
                "bg-primary absolute top-0 left-0 h-1.5 rounded-full",
                `w-[calc(${progressPercentage(
                  Number(item?.contest?.questions_count || 0),
                  Number(item?.answers_count || 0),
                )}%)]`,
                `${item.status === "submitted" ? "w-full" : ""}`,
              )}
            ></div>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default ContestHistory;
