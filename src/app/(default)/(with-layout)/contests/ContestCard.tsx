/** @format */
"use client";
import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import { ContestType } from "@/types/contest";

import contestImage from "@/../public/contest-image.png";
import { textTrim } from "@/utils/helper";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CoinIcon,
  CoinsIcon,
  FireIcon,
  GraduationCapIcon,
  HeartIcon,
  MedalIcon,
  TrophyIcon,
} from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import toast, { LoaderIcon } from "react-hot-toast";

const Countdown = dynamic(() => import("@/components/ui/Countdown"), {
  ssr: false,
});

const ContestDifficultyLabelIcon: any = {
  advanced: {
    icon: <FireIcon />,
    color: "bg-red-500",
  },
  beginner: {
    icon: <CoinsIcon />,
    color: "bg-yellow-500",
  },
  intermediate: {
    icon: <ChartBarIcon />,
    color: "bg-blue-500",
  },
};

type Props = {
  contest: ContestType;
  isFavorite?: boolean;
  refetch: () => void;
};
export default function ContestCard({
  contest,
  isFavorite = false,
  refetch,
}: Props) {
  const { tran } = useTranslations();
  const { mutate: favoriteContest, isLoading } = useQueryMutation({
    url: `profile/favorites`,
  });

  const { user } = useAuthStore((state: AuthStore) => state);

  const handleFavorite = () => {
    favoriteContest(
      {
        slug: contest.translation.slug,
        type: contest.is_favorite || isFavorite ? "remove" : "add",
        favorable_type: "contest",
      },
      {
        onSuccess: (response: any) => {
          refetch();
          toast.success(tran(response?.data?.message));
        },
      },
    );
  };
  const price = useMemo(
    () =>
      contest?.prizes && contest?.prizes[0]?.amount
        ? Number(contest?.prizes[0]?.amount)
        : 0,
    [contest],
  );

  return (
    <div className="border-primary/20 relative overflow-hidden rounded-xl border">
      <div className="relative">
        <div className="from-primary via-primary/0 absolute bottom-0 h-20 w-full bg-gradient-to-t to-transparent"></div>
        <ImageLoader
          alt={contest?.translation?.title}
          className="h-[200px] w-full object-cover"
          height={200}
          width={400}
          withSkeleton={true}
          src={contest?.image || contestImage}
        />

        <div className="absolute inset-0 z-20 flex flex-col items-end justify-between bg-black/40 p-4 text-white">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-start gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-medium">
              <GraduationCapIcon className="text-base" />{" "}
              {tran(contest?.category?.title)}
            </div>
            <div
              className={`flex items-center justify-start gap-1 ${ContestDifficultyLabelIcon[contest?.contest_label]?.color} rounded-full px-2.5 py-1 text-xs font-medium`}
            >
              {ContestDifficultyLabelIcon[contest?.contest_label]?.icon}{" "}
              {tran(contest?.contest_label_name)}
            </div>
          </div>
          <div className="flex w-full flex-1 items-end justify-between gap-3">
            <div className="flex-start flex items-center gap-1">
              <div className="flex items-center justify-start gap-1">
                <ClockIcon className="text-base" />
                <p>
                  {contest?.questions_sum_time_limit} {tran("min")}
                </p>
              </div>

              <div className="flex items-center justify-start gap-1">
                <MedalIcon className="text-base" />
                <p>
                  {contest?.questions_count} {tran("questions")}
                </p>
              </div>
            </div>
            {user && (
              <button
                onClick={handleFavorite}
                className="flex size-8 items-center justify-center rounded-full bg-white text-lg text-black"
              >
                {isFavorite || contest?.is_favorite ? (
                  <HeartIcon weight="fill" className="text-primary" />
                ) : isLoading ? (
                  <LoaderIcon size={20} className="text-primary" />
                ) : (
                  <HeartIcon />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-start justify-start p-4">
        <h5 className="heading-5">{contest?.translation.title.slice(0, 30)}</h5>
        <p className="text-light4 pb-3">
          {textTrim(tran(contest?.translation.description), 40)}
        </p>

        <div className="bg-primary/10 w-full rounded-lg p-3">
          <div className="flex items-center justify-between text-xs xl:text-sm">
            <p className="text-light4 flex items-center justify-start gap-1 font-medium">
              <CalendarIcon className="text-base" />{" "}
              {moment(contest?.start_time).format("MMM DD")} -{" "}
              {moment(contest?.end_time).format("MMM DD, YYYY")}
            </p>

            {contest?.status === "upcoming" && (
              <p className="text-primary flex items-center justify-start gap-1 font-medium">
                <ClockIcon className="text-base" />
                <Countdown dateTime={contest?.start_time} />
              </p>
            )}

            {contest?.status === "running" && (
              <p className="text-primary flex items-center justify-start gap-1 font-medium">
                Running
              </p>
            )}

            {contest?.status === "completed" && (
              <p className="flex items-center justify-start gap-1 font-medium text-red-500">
                Ended
              </p>
            )}
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <p className="text-light4 text-sm">{tran("Spots")}</p>
              <p className="text-light4 text-sm font-medium">
                {contest?.participants_count}/{contest?.participant_limit}{" "}
              </p>
            </div>
            <div className="bg-primary/40 relative h-1.5 w-full rounded-full">
              <div
                className="bg-primary absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${(contest?.participants_count / contest?.participant_limit) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 py-3">
          <div className="bg-primary/10 flex items-center justify-start gap-3 rounded-md px-3 py-2">
            <div className="">
              <TrophyIcon className="text-primary text-2xl" />
            </div>
            <div className="text-sm">
              <p className="text-light4 font-medium">{tran("Prize Pool")}</p>
              <p className="text-primary flex items-center justify-start gap-0.5 font-semibold">
                <CoinIcon /> {price}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-start gap-3 rounded-md border border-yellow-100 bg-yellow-50 px-3 py-2">
            <div className="text-yellow-600">
              <CoinsIcon className="text-2xl" />
            </div>
            <div className="text-sm">
              <p className="text-light4 font-medium">{tran("Entry Fee")}</p>
              <p className="flex items-center justify-start gap-0.5 font-semibold">
                <CoinIcon /> {contest?.entry_fee}
              </p>
            </div>
          </div>
        </div>

        {!contest?.taken_status && contest?.status === "upcoming" && (
          <Button
            href={`/contests/${contest?.translation?.slug}`}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              {tran("Contest Details")} <ArrowRightIcon />
            </span>
          </Button>
        )}

        {!contest?.taken_status && contest?.status === "running" && (
          <Button
            href={`/contests/${contest?.translation?.slug}`}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              {tran("Contest Details")} <ArrowRightIcon />
            </span>
          </Button>
        )}

        {!contest?.taken_status && contest?.status === "completed" && (
          <Button
            href={`/contests/${contest?.translation?.slug}`}
            className="w-full"
            variant="danger-outline"
          >
            <span className="flex items-center justify-center gap-2">
              {tran("Contest Ended")} <ArrowRightIcon />
            </span>
          </Button>
        )}

        {contest?.taken_status === "pending" &&
          contest?.status === "completed" && (
            <Button
              href={`/contests/${contest?.translation?.slug}`}
              className="w-full"
              variant="danger-outline"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("Contest Ended")} <ArrowRightIcon />
              </span>
            </Button>
          )}
        {contest?.taken_status === "running" &&
          contest?.status === "upcoming" && (
            <Button
              href={`/contests/${contest?.translation?.slug}`}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("Contest Details")} <ArrowRightIcon />
              </span>
            </Button>
          )}
        {contest?.taken_status === "running" &&
          contest?.status === "running" && (
            <Button
              href={`/play/contest?contest=${contest?.translation?.slug}`}
              className="w-full"
              variant="primary-outline"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("Start Playing")}
              </span>
            </Button>
          )}

        {contest?.taken_status === "pending" &&
          contest?.status === "running" && (
            <div className="flex w-full justify-between gap-2">
              <Button
                href={`/play/contest?contest=${contest?.translation?.slug}`}
                className="w-full"
                variant="primary-outline"
              >
                <span className="flex items-center justify-center gap-2">
                  {tran("Start Playing")} <ArrowRightIcon />
                </span>
              </Button>
              <Button
                href={`/contests/${contest?.translation?.slug}`}
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  {tran("Contest Details")} <ArrowRightIcon />
                </span>
              </Button>
            </div>
          )}

        {contest?.taken_status === "pending" &&
          contest?.status === "upcoming" && (
            <div className="flex w-full justify-between gap-2">
              <Button
                variant="primary-outline"
                className="!text-primary w-full !cursor-default hover:bg-transparent"
              >
                <span className="flex items-center justify-center gap-2">
                  {tran("Already Taken")}
                </span>
              </Button>

              <Button
                href={`/contests/${contest?.translation?.slug}`}
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  {tran("Contest Details")} <ArrowRightIcon />
                </span>
              </Button>
            </div>
          )}

        {contest?.taken_status === "submitted" && (
          <div className="flex w-full justify-between gap-2">
            <Button
              href={`/result/contest?contest=${contest?.translation?.slug}`}
              className="w-full"
              variant="secondary-outline"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("View Result")} <ArrowRightIcon />
              </span>
            </Button>

            <Button
              href={`/contests/${contest?.translation?.slug}`}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("Contest Details")} <ArrowRightIcon />
              </span>
            </Button>
          </div>
        )}

        {contest?.taken_status === "won" && (
          <div className="flex w-full justify-between gap-2">
            <Button
              href={`/result/contest?contest=${contest?.translation?.slug}`}
              className="w-full"
              variant="secondary-outline"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("View Result")} <ArrowRightIcon />
              </span>
            </Button>

            <Button
              href={`/contests/${contest?.translation?.slug}`}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("Contest Details")} <ArrowRightIcon />
              </span>
            </Button>
          </div>
        )}

        {contest?.taken_status === "lost" && (
          <div className="flex w-full justify-between gap-2">
            <Button
              href={`/result/contest?contest=${contest?.translation?.slug}`}
              className="w-full"
              variant="secondary-outline"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("View Result")} <ArrowRightIcon />
              </span>
            </Button>

            <Button
              href={`/contests/${contest?.translation?.slug}`}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                {tran("Contest Details")} <ArrowRightIcon />
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
