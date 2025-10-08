/** @format */

"use client";
import ImageLoader from "@/components/ui/ImageLoader";
import Loader from "@/components/ui/Loader";
import ShareLinks from "@/components/ui/ShareLinks";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestDetailsType, ContestType } from "@/types/contest";
import { ClockIcon, CoinIcon, MedalIcon } from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import { useEffect, useState } from "react";
import PlayButton from "./PlayButton";
import Tabs from "./Tabs";

type Props = {
  slug: string;
};
export default function Details({ slug }: Props) {
  const { tran } = useTranslations();

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const link = `${origin}/contests/${slug}`;

  const {
    data: contest,
    refetch,
    isLoading,
  } = useGetQuery<ContestDetailsType>({
    url: `/single-contest/${slug}`,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="custom-container pt-20 sm:pt-28">
      <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
        {contest?.banner_image ? (
          <ImageLoader
            src={contest?.banner_image}
            height={300}
            width={1296}
            alt={contest?.translation?.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center rounded-sm bg-gray-300 dark:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-200 dark:text-gray-600"
              width="40"
              height="40"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26" />
                <path d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32" />
                <path d="m21.5 16.5l-4 3.991m0-3.982l4 3.991" />
              </g>
            </svg>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-start justify-end bg-black/40 p-6 text-white">
          <h2 className="heading-2">{contest?.translation.title}</h2>
          <div className="flex items-center justify-start gap-3 pt-1">
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
        </div>
      </div>
      <div className="pt-4">
        <div className="grid grid-cols-12 gap-6">
          <Tabs contest={contest as ContestType} />
          <div className="border-primary/20 col-span-12 h-fit rounded-xl border p-6 lg:col-span-4">
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="flex w-full items-center justify-between text-sm font-medium">
                <p>{tran("Spots Filled")}</p>
                <p className="">
                  {contest?.participants_count}/{contest?.participant_limit}
                </p>
              </div>
              <div className="bg-primary/40 relative h-1.5 w-full rounded-full">
                <div
                  className="bg-primary absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${((contest?.participants_count || 0) / (contest?.participant_limit || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-6 pb-4">
              <div className="border-primary/20 rounded-lg border p-4">
                <p className="pb-2 text-sm">{tran("Start Date")}</p>
                <p className="font-medium">
                  {contest?.start_time &&
                    moment(contest?.start_time).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="border-primary/20 rounded-lg border p-4">
                <p className="pb-2 text-sm">{tran("End Date")}</p>
                <p className="font-medium">
                  {contest?.start_time &&
                    moment(contest?.end_time).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="border-primary/20 rounded-lg border p-4">
                <p className="pb-2 text-sm">{tran("Category")}</p>
                <p className="font-medium capitalize">
                  {contest?.category?.title}
                </p>
              </div>

              <div className="border-primary/20 text-primary rounded-lg border p-4">
                <p className="pb-2 text-sm font-medium">
                  {tran("Enrollment Fee")}
                </p>
                <p className="flex items-center justify-start gap-2 font-medium">
                  <CoinIcon /> {contest?.entry_fee}
                </p>
              </div>
            </div>
            <PlayButton
              contest={contest as ContestDetailsType}
              refetch={refetch}
            />

            <ShareLinks
              link={`${link}`}
              text={`Play ${contest?.translation?.title}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
