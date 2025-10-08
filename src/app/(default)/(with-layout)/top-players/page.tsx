/** @format */
"use client";

import Breadcrumb from "@/components/partials/Breadcrumb";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import PlayerCard from "./PlayerCard";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

export default function TopPlayersPage() {
  const { tran } = useTranslations();
  const { data: topPlayers, isLoading } = useGetQuery({
    url: "leaderboard",
    params: { per_page: 10 },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Breadcrumb title={tran("Top Players")} />
      <div className="custom-container">
        <div className="stp-30 grid grid-cols-12 gap-6">
          {topPlayers?.slice(0, 10).map((item: any, index: number) => (
            <PlayerCard key={index} item={item} index={index} tran={tran} />
          ))}
        </div>
      </div>
    </div>
  );
}
