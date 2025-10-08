/** @format */
"use client";
import { Button } from "@/components/ui/Button";
import useClickOutside from "@/hooks/useClickOutside";
import { useContestStatus } from "@/hooks/useContestStatus";
import { ContestDetailsType } from "@/types/contest";
import { cn } from "@/utils/cn";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Countdown = dynamic(() => import("@/components/ui/Countdown"), {
  ssr: false,
});

const ContestJoinModal = dynamic(() => import("./ContestJoinModal"), {
  ssr: false,
});

type Props = {
  contest: ContestDetailsType;
  refetch: () => void;
};
const PlayButton: React.FC<Props> = ({ contest, refetch }) => {
  const { modalRef, modal, setModal } = useClickOutside();

  const { upcomingContest, runningContest, completedContest } =
    useContestStatus(contest);

  useEffect(() => {
    if (runningContest) {
      refetch();
    }
  }, [runningContest, refetch]);

  return (
    <React.Fragment>
      {contest?.has_taken ? (
        <>
          {contest?.participants[0]?.status === "submitted" && (
            <Button
              href={`/result/contest?contest=${contest?.translation.slug}`}
              className="w-full"
            >
              Show Result
            </Button>
          )}

          {contest?.participants[0]?.status === "running" && (
            <Button
              href={`/play/contest?contest=${contest?.translation.slug}`}
              className="w-full"
            >
              Play Now
            </Button>
          )}

          {runningContest && contest?.participants[0]?.status === "pending" && (
            <Button
              className="w-full"
              href={`/play/contest?contest=${contest?.translation?.slug}`}
            >
              Play Now
            </Button>
          )}

          {upcomingContest && (
            <>
              <Button
                className={cn(
                  upcomingContest
                    ? "text-primary w-full !cursor-default bg-transparent"
                    : "w-full",
                )}
              >
                <p>Countdown:</p>
                <Countdown dateTime={contest?.start_time || ""} />
              </Button>

              <div
                id="statusNote"
                className="bg-primary/10 text-primary my-3 rounded-xl px-4 py-3 text-sm"
              >
                Contest unlocks in{" "}
                <span className="font-semibold">
                  <Countdown dateTime={contest?.start_time || ""} />
                </span>
                . Please wait until the timer reaches zero to start playing.
              </div>

              <Button className="w-full" disabled={true}>
                Play Now
              </Button>
            </>
          )}

          {contest?.participants[0]?.status === "won" && (
            <Button
              className="w-full"
              href={`/result/contest?contest=${contest?.translation.slug}`}
            >
              Show Result
            </Button>
          )}
        </>
      ) : (
        <>
          {completedContest && (
            <Button
              className="w-full !cursor-default !text-red-500 hover:bg-transparent"
              variant="danger-outline"
              onClick={() => toast.error("Contest Ended")}
            >
              Contest Ended
            </Button>
          )}
          {(upcomingContest || runningContest) && (
            <Button className="w-full" onClick={() => setModal(true)}>
              Unlock Now
            </Button>
          )}
        </>
      )}
      <ContestJoinModal
        modalRef={modalRef}
        showModal={modal}
        setShowModal={setModal}
        contest={contest}
        refetch={refetch}
      />
    </React.Fragment>
  );
};

export default PlayButton;

export const handleStartContest = (
  contest: ContestDetailsType,
  push: (path: string) => void,
  tran: (key: string) => string,
  upcomingContest: boolean,
  runningContest: boolean,
  completedContest: boolean,
) => {
  if (contest?.has_taken) {
    if (upcomingContest) {
      push(`/play/contest?contest=${contest?.translation.slug}`);
      return;
    } else if (completedContest) {
      push(`/result/contest?contest=${contest?.translation.slug}`);
      return;
    }
  }

  toast.error(tran("Contest has not started yet!"));
};
