/** @format */

import { useTranslations } from "@/providers/TranslationProviders";
import { QuizType } from "@/types/quiz";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Labels from "./Labels";
type Props = {
  quizDetails: QuizType;
};
const Overview: React.FC<Props> = ({ quizDetails }) => {
  const { tran } = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "0";

  const handleTabChange = (id: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", id);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (!quizDetails?.has_level) {
    return (
      <div className="col-span-12 lg:col-span-8">
        <div className="pt-8">
          <div className="">
            <h5 className="heading-5">{tran("Description")}</h5>
            <p className="text-light4 pt-3">
              {quizDetails?.translation?.description}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-12 lg:col-span-8">
      <div className="flex items-center justify-start">
        {["Overview", "Levels"].map((item, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index.toString())}
            className={`${index == Number(currentTab) ? "border-primary text-primary" : "border-slate-300"} flex-1 border-b-2 py-3 font-medium`}
          >
            {item}
          </button>
        ))}
      </div>
      {Number(currentTab) == 0 && (
        <div className="pt-8">
          <div className="">
            <h5 className="heading-5">{tran("Description")}</h5>
            <p className="text-light4 pt-3">
              {quizDetails?.translation?.description}
            </p>
          </div>
        </div>
      )}
      {Number(currentTab) == 1 && (
        <div className="pt-8">
          <div className="">
            <h5 className="heading-5">{tran("Levels")}</h5>
            <div className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-4 sm:gap-4 md:gap-6">
              <Labels
                labels={quizDetails?.levels || []}
                quiz_slug={quizDetails?.translation?.slug}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
