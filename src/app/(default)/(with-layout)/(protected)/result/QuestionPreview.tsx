/** @format */

"use client";
import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import { ContestQuestionType } from "@/types/contest";
import { QuizQuestionType } from "@/types/quiz";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type WaveSurfer from "wavesurfer.js";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const WavesurferPlayer = dynamic(() => import("@wavesurfer/react"), {
  ssr: false,
});

type Props = {
  currentQuestion: ContestQuestionType | QuizQuestionType;
  setOrder: React.Dispatch<React.SetStateAction<number>>;
  order: number;
  total: number;
};

const QuestionPreview: React.FC<Props> = ({
  currentQuestion,
  setOrder,
  order,
  total,
}) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const answer = useMemo(() => {
    return currentQuestion?.answers?.length
      ? currentQuestion?.answers[0]
      : null;
  }, [currentQuestion]);

  const onPlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  const renderQuestionText = (text: string) => {
    const parts = text.split(/\{.*?\}/g);
    const matches = text.match(/\{.*?\}/g) || [];
    return parts.flatMap((part, index) => [
      <span key={`part-${index}`}>{part}</span>,
      index < matches.length ? (
        <span
          key={`line-${index}`}
          className="border-primary mx-1 -mb-3 inline-block h-px w-20 border-b align-middle"
        ></span>
      ) : null,
    ]);
  };

  return (
    <div className="flex w-full flex-col pt-4 sm:px-6 lg:px-20">
      <h4 className="heading-4 text-center">
        {renderQuestionText(currentQuestion?.translation?.question_text)}
      </h4>

      {currentQuestion?.explanation_type === "text" && (
        <div className="mt-4 text-center">
          <p>
            <span className="text-primary">Question Exp:</span>{" "}
            {currentQuestion?.translation?.question_explanation}
          </p>
        </div>
      )}

      <div className="flex w-full items-center justify-center gap-6 py-8 max-lg:flex-col lg:py-24 2xl:gap-12">
        {currentQuestion?.explanation_type !== "text" && (
          <div className="w-full max-w-[500px] lg:w-1/2">
            {currentQuestion?.explanation_type === "image" &&
              currentQuestion?.translation?.question_explanation && (
                <ImageLoader
                  src={currentQuestion?.translation?.question_explanation}
                  alt="Question Explanation"
                  width={500}
                  height={500}
                />
              )}
            {currentQuestion?.explanation_type === "video" &&
              currentQuestion?.translation?.question_explanation && (
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={currentQuestion?.translation?.question_explanation}
                  controls
                />
              )}
            {currentQuestion?.explanation_type === "audio" &&
              currentQuestion?.translation?.question_explanation && (
                <div className="bg-primary/5 flex w-full gap-3 px-3 py-3 sm:px-6 sm:py-5">
                  <Button
                    onClick={onPlayPause}
                    className="bg-primary flex size-14 shrink-0 items-center justify-center rounded-full text-xl text-white sm:text-2xl"
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </Button>
                  <div className="flex-1">
                    <WavesurferPlayer
                      height={60}
                      waveColor="#262D3B"
                      progressColor="#4D6BFE"
                      url={currentQuestion?.translation?.question_explanation}
                      onReady={setWavesurfer}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      barWidth={2}
                      barGap={1}
                    />
                  </div>
                </div>
              )}
          </div>
        )}

        <div className="flex w-full max-w-[400px] flex-col gap-3">
          {currentQuestion?.options.map((opt, idx) => {
            const submittedAnswers = answer?.answer_text ?? [];
            const correctAnswers = currentQuestion?.correct_answers ?? [];

            const isSelected = submittedAnswers.includes(opt.value);
            const isCorrect = correctAnswers.includes(opt.value);

            let bgClass = "border-dark5";

            if (isCorrect && isSelected) {
              bgClass = "bg-primary/5 border-primary";
            } else if (isCorrect && !isSelected) {
              bgClass = "bg-primary/5 border-primary";
            } else if (!isCorrect && isSelected) {
              bgClass = "bg-red-600/5 border-red-600";
            }

            return (
              <div key={opt.value} className="text-start">
                <span
                  className={`flex gap-3 rounded-md border px-4 py-3 duration-300 ${bgClass}`}
                >
                  <span className="border-dark5 flex size-7 items-center justify-center rounded-sm border">
                    {idx + 1}
                  </span>
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {currentQuestion?.explanation_type === "text" && (
        <div className="mb-4 text-center">
          <p>
            <span className="text-secondary">Answer Exp:</span>{" "}
            {currentQuestion?.translation?.answer_explanation}
          </p>
        </div>
      )}

      {currentQuestion?.explanation_type !== "text" && (
        <div className="w-full max-w-[500px] lg:w-1/2">
          {currentQuestion?.explanation_type === "image" &&
            currentQuestion?.translation?.answer_explanation && (
              <ImageLoader
                src={currentQuestion?.translation?.answer_explanation}
                alt="Question Explanation"
                width={500}
                height={500}
              />
            )}
          {currentQuestion?.explanation_type === "video" &&
            currentQuestion?.translation?.answer_explanation && (
              <ReactPlayer
                width="100%"
                height="100%"
                url={currentQuestion?.translation?.answer_explanation}
                controls
              />
            )}
          {currentQuestion?.explanation_type === "audio" &&
            currentQuestion?.translation?.answer_explanation && (
              <div className="bg-primary/5 flex w-full gap-3 px-3 py-3 sm:px-6 sm:py-5">
                <Button
                  onClick={onPlayPause}
                  className="bg-primary flex size-14 shrink-0 items-center justify-center rounded-full text-xl text-white sm:text-2xl"
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </Button>
                <div className="flex-1">
                  <WavesurferPlayer
                    height={60}
                    waveColor="#262D3B"
                    progressColor="#4D6BFE"
                    url={currentQuestion?.translation?.answer_explanation}
                    onReady={setWavesurfer}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    barWidth={2}
                    barGap={1}
                  />
                </div>
              </div>
            )}
        </div>
      )}

      <div className="border-dark5 flex w-full items-center justify-between gap-6 border-t pt-4">
        {order > 1 ? (
          <Button
            onClick={() => setOrder((prev) => prev - 1)}
            variant="primary"
            className="rounded-sm px-8 py-2.5 font-medium text-white"
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        {order < total && (
          <Button
            onClick={() => setOrder((prev) => prev + 1)}
            variant="primary"
            className="rounded-sm px-8 py-2.5 font-medium text-white"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionPreview;
