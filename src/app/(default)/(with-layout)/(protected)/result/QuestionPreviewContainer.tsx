/** @format */

import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestResultResponseType } from "@/types/contest";
import { QuizResultResponseType } from "@/types/quiz";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { memo, useMemo, useState } from "react";

const QuestionPreview = dynamic(() => import("./QuestionPreview"), {
  ssr: false,
});

const DataNotFound = dynamic(() => import("@/components/ui/DataNotFound"), {
  ssr: false,
});

type Props = {
  data: QuizResultResponseType | ContestResultResponseType;
};
const QuestionPreviewContainer: React.FC<Props> = ({ data }) => {
  const [order, setOrder] = useState(1);
  const { tran } = useTranslations();
  const currentQuestion = useMemo(() => {
    const currentQuestion = data?.questions?.find(
      (question) => question.order == order,
    );
    return currentQuestion;
  }, [order, data?.questions]);

  const router = useRouter();

  return (
    <div className="pt-[120px]">
      <div className="custom-container">
        <div className="bg-primary/5 border-dark5 flex w-full max-w-[1350px] flex-col items-center justify-center overflow-auto rounded-xl border p-6">
          <div className="flex w-full items-center justify-start">
            <Button variant="primary-outline" onClick={() => router.back()}>
              <ArrowLeftIcon className="size-5 text-xl" /> {tran("Back")}
            </Button>
          </div>
          <div className="flex w-full items-center justify-center gap-3 max-md:flex-col lg:gap-6 lg:px-20">
            <div className="bg-primary/20 relative h-2 w-full rounded-full max-md:order-2">
              <div
                className="bg-primary absolute top-0 left-0 h-full rounded-full"
                style={{ width: `100%` }}
              ></div>
            </div>
            <div className="flex items-center justify-start gap-3 max-md:order-1 max-md:w-full max-md:justify-between">
              <div className="border-dark5 flex items-center justify-center gap-2 rounded-sm border px-2 py-2 max-md:text-sm md:px-4 md:py-3">
                <span className="font-semibold max-[450px]:hidden">Q:</span>
                <span className="flex items-center justify-center gap-1">
                  <span>{order}</span>/ <span>{data?.questions.length}</span>
                </span>
              </div>
            </div>
          </div>
          {currentQuestion ? (
            <QuestionPreview
              currentQuestion={currentQuestion}
              setOrder={setOrder}
              order={order}
              total={data?.questions?.length}
            />
          ) : (
            <DataNotFound
              title="Question not found"
              message="Please try again. If the problem persists, contact support."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(
  QuestionPreviewContainer,
  (prev, next) => prev?.data === next?.data,
);
