/** @format */
"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { usePageComponent } from "@/hooks/usePageComponent";
import { ContestApiResponse } from "@/types/contest";
import { getToken } from "@/utils";
import { ArrowRightIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { Button } from "../ui/Button";

const Skeleton = dynamic(() => import("@/components/ui/QuizItemSkeleton"), {
  ssr: false,
});

const Contests = dynamic(
  () => import("@/app/(default)/(with-layout)/contests/Contests"),
  {
    ssr: false,
  },
);

const FirstThreeContest = ({ slug }: { slug: string }) => {
  const { getData } = usePageComponent({
    slug,
    sectionSlug: "upcoming-contests",
  });

  const token = getToken();

  const {
    data: contests,
    isLoading,
    refetch,
  } = useGetQuery<ContestApiResponse>({
    isPublic: !token,
    url: "get-contests",
    queryKey: "contests",
    params: {
      page: 1,
      per_page: 3,

      sort_column: "start_time",
      sort_by: "asc",
    },
  });

  return (
    <section className="hidden lg:block">
    <div className="custom-container stp-30 sbp-30">
      <div className="mx-auto flex max-w-[526px] flex-col items-center justify-center text-center">
        <h2 className="heading-2">{getData("title", "Upcoming Contests")}</h2>
        <p className="text-light2 pt-3 text-lg">
          {getData(
            "description",
            "Showing some upcoming contests with title and description.",
          )}
        </p>
      </div>

      {/* quiz list */}

      <div className="stp-15">
        {isLoading ? (
          <Skeleton total={9} />
        ) : (
          <Contests contests={contests} refetch={refetch} />
        )}
      </div>

      <div className="mt-5 flex items-center justify-center md:mt-10">
        <Button href="/contests">
          View All Contests <ArrowRightIcon />
        </Button>
      </div>
    </div>
    </section>
  );
};

export default FirstThreeContest;
