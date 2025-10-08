/** @format */

"use client";
import illus from "@/../public/illustration/bg-shape-3.png";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import Image from "next/image";
import Link from "next/link";

import { usePageComponent } from "@/hooks/usePageComponent";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

const PlayerCard = dynamic(
  () => import("@/app/(default)/(with-layout)/top-players/PlayerCard"),
  {
    ssr: false,
  },
);

export default function TopPlayers({ slug }: Readonly<{ slug: string }>) {
  const { getData } = usePageComponent({
    slug,
    sectionSlug: "top-players",
  });
  const { tran } = useTranslations();
  const { data: topPlayers, isLoading } = useGetQuery({
    url: "leaderboard",
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="stp-30 sbp-30 relative overflow-hidden bg-slate-50">
      <div className="bg-secondary/30 absolute -bottom-10 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
      <div className="absolute right-0 -bottom-10 size-[480px] rounded-full bg-yellow-100 blur-[200px] xl:-right-20"></div>
      <Image alt="" src={illus} className="absolute bottom-0 left-0 z-10" />
      <div className="custom-container relative z-10">
        <div className="flex items-center justify-between gap-6">
          <div className="flex max-w-[526px] flex-col items-start justify-start">
            <h2 className="heading-2">{getData("title", "Top Player")}</h2>
            <p className="text-light2 pt-3 text-lg">
              {getData(
                "description",
                "Create an account, explore quizzes, test your knowledge, and track your progress effortlessly.",
              )}
            </p>
          </div>
          <Link
            href={getData("button.link", "/top-players")}
            className="btn-primary px-6"
          >
            {getData("button.text", "View More")}
          </Link>
        </div>
        <div className="stp-15 grid grid-cols-12 gap-6">
          {topPlayers?.slice(0, 4).map((item: any, index: number) => (
            <PlayerCard key={index} item={item} index={index} tran={tran} />
          ))}
        </div>
      </div>
    </section>
  );
}
