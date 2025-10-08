/** @format */

"use client";
import Loader from "@/components/ui/Loader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import { PaginationDataTypes } from "@/types";
import { ParticipantType } from "@/types/contest";
import { UserQuizType } from "@/types/quiz";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

const ContestHistory = dynamic(() => import("./ContestHistory"), {
  ssr: false,
});

const QuizHistory = dynamic(() => import("./QuizHistory"), {
  ssr: false,
});

export interface UserHistoryApiResponse extends PaginationDataTypes {
  data: ParticipantType[] | UserQuizType[];
}
export default function HistoryPage() {
  const { push } = useRouter();
  const [tab, setTab] = useState("quiz");
  const [page, setPage] = useState(1);
  const { tran } = useTranslations();
  const {
    data: historyData,
    isLoading,
    refetch,
  } = useGetQuery<UserHistoryApiResponse>({
    url: `profile/quiz-history?type=${tab}`,
    queryKey: ["history", tab],
    params: { page },
  });

  useEffect(() => {
    setPage(1);
  }, [tab]);

  const handlePageChange = (page: number) => {
    setPage(page);
    push(`/dashboard/history?page=${page}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="border-primary/20 rounded-xl border p-6">
      <h3 className="heading-3 !font-medium">{tran("Quiz History")}</h3>
      <div className="flex items-center justify-between pt-6">
        {["quiz", "contest"].map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setTab(item);
              refetch();
            }}
            className={`${item === tab ? "border-primary text-primary" : "border-slate-300 text-slate-500"} flex-1 border-b-2 py-3 text-xl font-medium capitalize`}
          >
            {tran(item)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 pt-6">
        {tab === "quiz" && (
          <QuizHistory userQuizzes={historyData?.data as UserQuizType[]} />
        )}

        {tab === "contest" && (
          <ContestHistory
            participants={historyData?.data as ParticipantType[]}
          />
        )}
        <Pagination
          currentPage={page}
          lastPage={historyData?.last_page || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
