/** @format */
import { ContestDetailsType, ContestType } from "@/types/contest";
import { useEffect, useMemo, useState } from "react";

export const useContestStatus = (contest: ContestDetailsType | ContestType) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { upcomingContest, runningContest, completedContest } = useMemo(() => {
    if (!contest) {
      return {
        upcomingContest: false,
        runningContest: false,
        completedContest: false,
      };
    }

    const start = new Date(contest.start_time);
    const end = new Date(contest.end_time);

    return {
      upcomingContest: start > now,
      runningContest: start <= now && end >= now,
      completedContest: end < now,
    };
  }, [contest, now]);

  return { upcomingContest, runningContest, completedContest };
};
