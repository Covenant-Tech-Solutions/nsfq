/** @format */
"use client";
import { Button } from "@/components/ui/Button";
import { getQueryClient } from "@/configs/query-client";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useContestStatus } from "@/hooks/useContestStatus";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestDetailsType } from "@/types/contest";
import {
  CoinIcon,
  QuestionIcon,
  ShareNetworkIcon,
  WalletIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

const Countdown = dynamic(() => import("@/components/ui/Countdown"), {
  ssr: false,
});

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  contest: ContestDetailsType;
  refetch: () => void;
  modalRef: React.RefObject<HTMLDivElement | null>;
};

const ContestJoinModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  contest,
  refetch,
  modalRef,
}) => {
  const { tran } = useTranslations();
  const { user, isAuthenticated, getUser } = useAuthStore((state) => state);
  const { mutate: joinContest, isLoading } = useQueryMutation({
    url: `join-contest/${contest?.translation?.slug}`,
  });

  const currentPath = usePathname();
  const { upcomingContest, runningContest } = useContestStatus(contest);

  const handleRedirect = useCallback(() => {
    window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
  }, [currentPath]);

  const handleAssignQuiz = useCallback(() => {
    if (!isAuthenticated) {
      handleRedirect();
      return;
    }
    joinContest(
      {},
      {
        onSuccess: (response: any) => {
          getUser();
          refetch();
          toast.success(response?.data?.data?.message);
          getQueryClient().invalidateQueries({ queryKey: ["contests"] });
        },
      },
    );
  }, [isAuthenticated, handleRedirect, joinContest, getUser, refetch]);

  const countDownButton = useMemo(() => {
    if (!contest) return null;
    const hasTaken = contest.has_taken;
    const startTime = contest.start_time;

    if (hasTaken) {
      return upcomingContest ? (
        <Button
          variant="primary-outline"
          className="hover:text-primary w-full !cursor-default hover:bg-transparent"
        >
          <Countdown dateTime={startTime || ""} />
        </Button>
      ) : (
        <>
          {runningContest && contest?.participants[0]?.status === "pending" && (
            <Button
              className="w-full"
              href={`/play/contest?contest=${contest?.translation?.slug}`}
            >
              Play Now
            </Button>
          )}
        </>
      );
    }

    return (
      <Button
        className="w-full"
        loading={isLoading}
        disabled={isLoading}
        onClick={handleAssignQuiz}
      >
        {tran("Unlock Now")}
      </Button>
    );
  }, [
    contest,
    isLoading,
    handleAssignQuiz,
    tran,
    upcomingContest,
    runningContest,
  ]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 text-center ${showModal ? "visible opacity-100" : "invisible opacity-0"} duration-500`}
    >
      <div
        ref={modalRef}
        className={`mx-2 w-full max-w-[450px] rounded-xl bg-white p-4 sm:p-8 ${showModal ? "scale-100" : "scale-95"} flex flex-col items-start justify-start overflow-auto duration-500`}
      >
        <Button
          onClick={() => setShowModal(false)}
          variant="danger-outline"
          className="absolute top-4 right-4 rounded-full p-2 max-sm:size-10"
        >
          <XIcon className="h-5 w-5" />
        </Button>
        <h4 className="heading-4">{tran("Start Your Contest")}</h4>
        <p className="text-light4 pt-2 text-sm">
          {tran("Please review and confirm your quiz details")}
        </p>
        <div className="bg-primary/10 mt-6 flex w-full flex-col gap-3 rounded-xl p-4 text-sm">
          <div className="flex w-full items-center justify-between">
            <div className="text-light4 flex items-center justify-start gap-2">
              <QuestionIcon className="text-base" />
              <p className="">{tran("Questions")}</p>
            </div>
            <p className="font-medium">
              {contest?.questions_count} {tran("Questions")}
            </p>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="text-light4 flex items-center justify-start gap-2">
              <CoinIcon className="text-base" />
              <p className="">{tran("Entry Fee")}</p>
            </div>
            <p className="font-medium">
              {contest?.is_free ? "Free" : contest?.entry_fee}
            </p>
          </div>
        </div>
        <div className="bg-primary/10 mt-6 flex w-full flex-col gap-3 rounded-xl p-4 text-sm">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="text-light4 flex items-center justify-start gap-2">
              <WalletIcon className="text-base" />
              <p className="">{tran("Available Coins")}</p>
            </div>
            <p className="font-medium">
              {tran("Available")} {user?.coins || 0} {tran("Coins")}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="text-light4 flex items-center justify-start gap-2">
              <CoinIcon className="text-base" />
              <p className="">{tran("Total Participants")}</p>
            </div>
            <p className="font-medium">
              {contest?.participants_count} {tran("Participants")}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 pt-6">
          {countDownButton}

          <Button onClick={() => setShowModal(false)} variant="danger-outline">
            {tran("Cancel")}
          </Button>
        </div>
        <div className="flex w-full items-center justify-center gap-2 pt-4 text-slate-400">
          <Link
            href={"/terms-conditions"}
            className="hover:text-primary text-sm font-medium underline duration-300"
          >
            {tran("View Rules & Terms")}
          </Link>
          <ShareNetworkIcon className="text-base" />
        </div>
      </div>
    </div>
  );
};

export default ContestJoinModal;
