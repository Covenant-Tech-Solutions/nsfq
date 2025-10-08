/** @format */

"use client";
import logo from "@/../public/logo.svg";
import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import Loader from "@/components/ui/Loader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import useClickOutside from "@/hooks/useClickOutside";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType } from "@/types";
import { ContestQuestionType, ContestType } from "@/types/contest";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });
const QuestionPage = dynamic(() => import("../Question"), { ssr: false });

const PALY_TYPE = "contest";

export default function PlayContest() {
  const searchParams = useSearchParams();

  const contest = searchParams.get(PALY_TYPE);
  const { modalRef, modal, setModal } = useClickOutside();

  const [questionOrder, setQuestionOrder] = useState(1);
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);
  const { data, isLoading, refetch, isFetching } = useGetQuery<ContestType>({
    url: `single-contest/${contest}?with_questions=true`,
  });

  const contestList = useMemo(() => {
    return data?.questions?.sort((a: any, b: any) => a.order - b.order) || [];
  }, [data]);

  const currentQuestion: ContestQuestionType = useMemo(() => {
    const currentQuestions = contestList?.filter(
      (contest: any) => !contest?.isAlreadyAnswered,
    );
    if (currentQuestions?.length) {
      const currentQuestion = currentQuestions[0];
      setQuestionOrder(currentQuestion.order);
      return currentQuestion as ContestQuestionType;
    }
    return {} as ContestQuestionType;
  }, [contestList]);

  const setQuestionTimeOut = useCallback(
    (updatedTime?: number) => {
      if (updatedTime) {
        localStorage.setItem(
          currentQuestion?.translation?.slug,
          updatedTime.toString(),
        );
        return;
      }
      if (currentQuestion) {
        localStorage.setItem(
          currentQuestion?.translation?.slug,
          ((currentQuestion?.time_limit || 0) * 60).toString(),
        );
      }
    },
    [currentQuestion],
  );

  const getQuestionTimeOut = () => {
    if (currentQuestion) {
      const stored = localStorage.getItem(currentQuestion?.translation?.slug);
      return stored ? parseInt(stored) : 0;
    }
    return 0;
  };

  const removeQuestionTimeOut = (questionOrder?: number) => {
    if (questionOrder) {
      const currentQuestion = contestList?.find(
        (contest: any) => contest.order === questionOrder,
      );
      localStorage.removeItem(currentQuestion?.translation?.slug || "");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen">
      <div className="custom-container flex h-screen items-center justify-center">
        <div className="bg-primary/5 border-dark5 flex w-full max-w-[1350px] flex-col items-center justify-center overflow-auto rounded-xl border p-6">
          <div className="cursor-disabled flex items-center justify-center gap-2">
            <ImageLoader
              src={appInfo?.application_info?.logo_favicon?.logo_dark || logo}
              alt={appInfo?.application_info?.company_info?.name}
              className="max-sm:size-7"
              width={40}
              height={40}
            />
            <span className="heading-3">
              {appInfo?.application_info?.company_info?.name}
            </span>
          </div>
          <div className="flex w-full items-center justify-center gap-3 max-md:flex-col lg:gap-6 lg:px-20">
            <div className="bg-primary/20 relative h-2 w-full rounded-full max-md:order-2">
              <div
                className="bg-primary absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${(100 / contestList.length) * questionOrder}%`,
                }}
              ></div>
            </div>
            <div className="flex items-center justify-start gap-3 max-md:order-1 max-md:w-full max-md:justify-between">
              <div className="border-dark5 flex items-center justify-center gap-2 rounded-sm border px-2 py-2 max-md:text-sm md:px-4 md:py-3">
                <span className="font-semibold max-[450px]:hidden">Q:</span>
                <span className="flex items-center justify-center gap-1">
                  <span>{currentQuestion?.order}</span>/{" "}
                  <span>{contestList.length}</span>
                </span>
              </div>
              <Button onClick={() => setModal(true)} variant="danger">
                Cancel
              </Button>
            </div>
          </div>
          {currentQuestion && (
            <QuestionPage
              playType={PALY_TYPE}
              refetch={refetch}
              questions={currentQuestion}
              questionOrder={questionOrder}
              totalQuestion={contestList.length}
              setQuestionTimeOut={setQuestionTimeOut}
              getQuestionTimeOut={getQuestionTimeOut}
              removeQuestionTimeOut={removeQuestionTimeOut}
              isFetching={isFetching}
            />
          )}
        </div>
      </div>
      <Modal modalRef={modalRef} openModal={modal} title="Cancel Contest">
        <Button
          onClick={() => setModal(false)}
          variant="danger-outline"
          className="absolute top-4 right-4 rounded-full p-2"
        >
          <XIcon className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-6">
          <Button
            onClick={() => {
              setModal(false);
            }}
            href="/contests"
            variant="danger"
          >
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
