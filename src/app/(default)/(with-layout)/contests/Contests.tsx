/** @format */
"use client";
import { ContestApiResponse } from "@/types/contest";
import dynamic from "next/dynamic";
import React, { memo, useMemo } from "react";

const DataNotFound = dynamic(() => import("@/components/ui/DataNotFound"), {
  ssr: false,
});

const ContestCard = dynamic(() => import("./ContestCard"), {
  ssr: false,
});

type Props = {
  contests: ContestApiResponse | undefined;
  refetch: () => void;
};

const Contests: React.FC<Props> = ({ contests, refetch }) => {
  const data = useMemo(() => {
    return contests?.data || [];
  }, [contests]);

  return data?.length ? (
    <div className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((contest) => (
        <ContestCard key={contest.id} contest={contest} refetch={refetch} />
      ))}
    </div>
  ) : (
    <DataNotFound
      title="Contests Not Found"
      message="No contests found. Please try again later."
      imageSrc="/quiz-not-found.webp"
    />
  );
};

export default memo(
  Contests,
  (prev, next) => prev?.contests?.data === next?.contests?.data,
);
