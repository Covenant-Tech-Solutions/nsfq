/** @format */

import { QuizQuestionTranslation } from "@/types/question";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";
import WavesurferPlayer from "@wavesurfer/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import type WaveSurfer from "wavesurfer.js";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type ExplanationProps = {
  explanation_type: string | undefined;
  translation: QuizQuestionTranslation | undefined;
};
const Explanation: React.FC<ExplanationProps> = ({
  explanation_type,
  translation,
}) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const onPlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };
  return (
    explanation_type !== "text" && (
      <div className="w-full max-w-[500px] lg:w-1/2">
        {explanation_type === "image" && translation?.question_explanation && (
          <Image
            src={translation?.question_explanation}
            alt="Question Explanation"
            width={500}
            height={500}
          />
        )}
        {explanation_type === "video" && translation?.question_explanation && (
          <ReactPlayer
            width="100%"
            height="100%"
            url={translation?.question_explanation}
            controls
          />
        )}
        {explanation_type === "audio" && translation?.question_explanation && (
          <div className="bg-primary/5 flex w-full gap-3 px-3 py-3 sm:px-6 sm:py-5">
            <button
              onClick={onPlayPause}
              className="bg-primary flex size-14 shrink-0 items-center justify-center rounded-full text-xl text-white sm:text-2xl"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="flex-1">
              <WavesurferPlayer
                height={60}
                waveColor="#262D3B"
                progressColor="#4D6BFE"
                url={translation?.question_explanation}
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
    )
  );
};

export default Explanation;
