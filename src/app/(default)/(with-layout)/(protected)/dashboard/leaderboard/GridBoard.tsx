/** @format */

import ImageLoader from "@/components/ui/ImageLoader";
import { CrownCrossIcon } from "@phosphor-icons/react/dist/ssr";
import { useMemo } from "react";

const GridBoard = ({
  leaderboards,
  tran,
}: {
  leaderboards: any;
  tran: any;
}) => {
  const firstThreeLeaderboards = useMemo(() => {
    if (!leaderboards?.length) return [];
    return leaderboards.slice(0, 3) || [];
  }, [leaderboards]);
  return (
    <div className="grid gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3">
      {firstThreeLeaderboards.map((leaderboard: any, index: number) => (
        <div
          key={leaderboard?.id}
          className="bg-primary/10 flex flex-col items-start justify-start rounded-xl p-6"
        >
          <div className="flex items-center justify-start gap-3">
            <CrownCrossIcon className="text-2xl text-yellow-500" />
            <p className="text-2xl font-medium">#{index + 1}</p>
          </div>
          <div className="flex items-center justify-start gap-3 pt-4">
            <div className="rounded-full bg-white p-1">
              <ImageLoader
                className="h-[50px] w-[50px] rounded-full object-cover"
                height={50}
                width={50}
                user={leaderboard}
                src={leaderboard?.avatar}
              />
            </div>
            <div className="">
              <p className="text-xl font-semibold">{leaderboard?.full_name}</p>
              <p className="text-slate-500">{leaderboard?.username}</p>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-2xl font-medium">{leaderboard?.score} XP</p>
            <div className="flex items-center justify-start gap-4 pt-1 text-slate-500">
              <p>
                {leaderboard?.quizzes_count} {tran("Quizzes")}
              </p>
              <p>
                {Number(leaderboard?.quizzes_avg_score ?? 0).toFixed(2)}%{" "}
                {tran("Avg")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridBoard;
