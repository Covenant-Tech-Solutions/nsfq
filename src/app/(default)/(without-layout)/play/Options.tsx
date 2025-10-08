/** @format */

import { useTranslations } from "@/providers/TranslationProviders";
import React from "react";
import { OptionsType } from "./Question";
type OptionProps = {
  options: OptionsType[] | undefined;
  selectedAnswer: string[];
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[]>>;
  isAlreadyAnswered?: boolean;
  isMultipleAns: boolean;
  correctAnswer?: string[];
};
const Options: React.FC<OptionProps> = ({
  options,
  selectedAnswer,
  setSelectedAnswer,
  isAlreadyAnswered,
  isMultipleAns,
  correctAnswer,
}) => {
  const { tran } = useTranslations();
  const getBorderColor = (itemValue: string) => {
    if (correctAnswer?.length) {
      if (correctAnswer.includes(itemValue)) {
        return "!border-primary"; // correct answer (selected or not)
      }
      if (selectedAnswer.includes(itemValue)) {
        return "border-red-600"; // wrong selected answer
      }
      return "border-dark5"; // not selected, not correct
    } else {
      return selectedAnswer.includes(itemValue)
        ? "!border-primary" // selected before answer is revealed
        : "border-dark5"; // not selected
    }
  };

  const getBgColor = (itemValue: string) => {
    if (correctAnswer?.length) {
      if (correctAnswer.includes(itemValue)) {
        return "!bg-primary"; // correct answer (selected or not)
      }
      if (selectedAnswer.includes(itemValue)) {
        return "bg-red-600"; // wrong selected answer
      }
      return "bg-dark5"; // not selected, not correct
    } else {
      return selectedAnswer.includes(itemValue)
        ? "!bg-primary" // selected before answer is revealed
        : "bg-dark5"; // not selected
    }
  };

  const handleSelectOption = (value: string) => {
    if (isMultipleAns) {
      setSelectedAnswer((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else {
      setSelectedAnswer([value]);
    }
  };

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-3 xl:min-h-[350px]">
      {isMultipleAns && (
        <p className="text-primary text-xl font-semibold">
          {" "}
          {tran("Answer can be one or more.")}
        </p>
      )}
      {options?.map((opt, idx) => (
        <button
          disabled={isAlreadyAnswered}
          key={opt.value}
          onClick={() => handleSelectOption(opt.value)}
          className="text-start"
        >
          <div
            className={`${isAlreadyAnswered ? "cursor-default opacity-60" : "hover:border-primary"} flex items-center gap-2 rounded-md border px-4 py-3 duration-300 ${getBorderColor(opt.value)}`}
          >
            {isMultipleAns ? (
              <div
                className={`border-primary/40 ${getBorderColor(opt.value)} flex size-[26px] items-center justify-center rounded-md border-2 p-[2px]`}
              >
                <div
                  className={`size-4 shrink-0 rounded-md ${getBgColor(opt.value)}`}
                ></div>
              </div>
            ) : (
              <div
                className={`border-primary/40 ${getBorderColor(opt.value)} flex size-[26px] items-center justify-center rounded-full border-2 p-[2px]`}
              >
                <div
                  className={`size-4 shrink-0 rounded-full ${getBgColor(opt.value)}`}
                ></div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="border-dark5 flex size-7 items-center justify-center rounded-sm border">
                {idx + 1}
              </span>
              {opt.label}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Options;
