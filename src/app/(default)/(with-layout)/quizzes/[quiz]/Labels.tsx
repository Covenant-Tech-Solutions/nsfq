/** @format */

import { QuizLevel } from "@/types/quiz";
import {
  CheckCircleIcon,
  LockIcon,
  LockKeyOpenIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React, { memo } from "react";

const Labels = ({
  labels,
  quiz_slug,
}: {
  labels: QuizLevel[];
  quiz_slug: string;
}) => {
  const labelItem = (item: QuizLevel) => {
    if (item?.status === "in_progress") {
      return (
        <Link
          href={`/play/quiz?quiz=${quiz_slug}&level_slug=${item?.slug}`}
          className="bg-primary/10 border-primary flex flex-col items-center justify-center rounded-lg border p-6"
        >
          <span className="text-4xl">
            <LockKeyOpenIcon className="text-primary" />
          </span>
          <p className={`text-primary rounded-md pt-3 text-xl font-bold`}>
            {item?.title}
          </p>
        </Link>
      );
    }

    if (item?.status === "completed") {
      return (
        <Link
          href={`/result/quiz/?quiz=${quiz_slug}&level_slug=${item?.slug}`}
          className="flex flex-col items-center justify-center rounded-lg bg-green-500 p-6"
        >
          <span className="text-4xl">
            <CheckCircleIcon className="text-white" />
          </span>
          <p className={`rounded-md pt-3 text-xl font-bold text-white`}>
            {item?.title}
          </p>
        </Link>
      );
    }
    return (
      <div className="bg-primary/10 flex cursor-not-allowed flex-col items-center justify-center rounded-lg p-6">
        <span className="text-4xl">
          <LockIcon className="text-gray-400" />
        </span>

        <p className={`rounded-md pt-3 text-xl font-bold text-gray-400`}>
          {item?.title}
        </p>
      </div>
    );
  };

  return labels?.map((item: QuizLevel) => (
    <React.Fragment key={item.id}>{labelItem(item)}</React.Fragment>
  ));
};

export default memo(Labels, (prev, next) => prev?.labels === next?.labels);
