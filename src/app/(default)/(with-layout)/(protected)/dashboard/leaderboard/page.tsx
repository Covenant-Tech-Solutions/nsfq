/** @format */

"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import React from "react";
import dynamic from "next/dynamic";

const GridBoard = dynamic(() => import("./GridBoard"), {
  ssr: false,
});

const GridBoardSkeleton = dynamic(() => import("./GridBoardSkeleton"), {
  ssr: false,
});

const Table = dynamic(() => import("./Table"), {
  ssr: false,
});

export default function Leaderboard() {
  const { tran } = useTranslations();
  const { data: getLeaderboardData, isLoading } = useGetQuery({
    url: `profile/leaderboards`,
    queryKey: "leaderboard",
    params: { per_page: 10 },
  });

  return (
    <div className="border-primary/20 bg-primary/5 overflow-hidden rounded-xl border p-3 sm:p-6">
      <h3 className="heading-3 !font-medium">{tran("Leaderboard")}</h3>

      <React.Fragment>
        {isLoading ? (
          <GridBoardSkeleton />
        ) : (
          <GridBoard leaderboards={getLeaderboardData} tran={tran} />
        )}

        <Table
          leaderboards={getLeaderboardData}
          tran={tran}
          isLoading={isLoading}
        />
      </React.Fragment>
    </div>
  );
}
