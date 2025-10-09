/** @format */

import quizBanner from "@/../public/quiz-banner.png";
import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import { QuizType } from "@/types/quiz";
import { textTrim } from "@/utils/helper";
import React from "react";
import toast, { LoaderIcon } from "react-hot-toast";

import useClickOutside from "@/hooks/useClickOutside";
import {
  ArrowRightIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CoinsIcon,
  FireIcon,
  HeartIcon,
  MedalIcon,
} from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";

const QuizAssignModal = dynamic(() => import("./QuizAssignModal"), {
  ssr: false,
});

const QuizDifficultyLabelIcon: any = {
  advanced: {
    icon: <FireIcon />,
    color: "bg-red-500",
  },
  beginner: {
    icon: <CoinsIcon />,
    color: "bg-yellow-500",
  },
  intermediate: {
    icon: <ChartBarIcon />,
    color: "bg-blue-500",
  },
};
export interface QuizListItemProps {
  refetch: () => void;
  quiz: QuizType;
  isFavorite?: boolean;
}

export default function QuizListItem({
  quiz,
  refetch,
  isFavorite = false,
}: QuizListItemProps) {
  const { tran } = useTranslations();
  const { modalRef, modal, setModal } = useClickOutside();

  const { mutate: favoriteQuiz, isLoading } = useQueryMutation({
    url: `profile/favorites`,
  });

  const { user } = useAuthStore((state: AuthStore) => state);

  const handleFavorite = () => {
    favoriteQuiz(
      {
        slug: quiz.translation.slug,
        type: quiz.is_favorite || isFavorite ? "remove" : "add",
        favorable_type: "quiz",
      },
      {
        onSuccess: (response: any) => {
          refetch();
          toast.success(response?.data?.message);
        },
      },
    );
  };

  return (
    <div className="border-primary/20 relative w-full overflow-hidden rounded-xl border p-2">
      <div className="relative overflow-hidden rounded-xl">
        <ImageLoader
          src={quiz?.image || quizBanner}
          width={1536}
          height={640}
          alt={tran(quiz?.translation?.title)}
          className="h-[220px] w-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 text-white">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center justify-start gap-1 ${QuizDifficultyLabelIcon[quiz?.quiz_level]?.color} rounded-full px-2.5 py-1 text-xs font-medium`}
            >
              {QuizDifficultyLabelIcon[quiz?.quiz_level]?.icon}{" "}
              {tran(quiz?.quiz_level_name)}
            </div>
            <div className="flex items-center justify-start gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-medium">
              <CheckCircleIcon />
              <p>{tran(quiz?.category?.title)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {user && (
              <button
                onClick={handleFavorite}
                className="flex size-8 items-center justify-center rounded-full bg-white text-lg text-black"
              >
                {isFavorite || quiz?.is_favorite ? (
                  <HeartIcon weight="fill" className="text-primary" />
                ) : isLoading ? (
                  <LoaderIcon size={20} className="text-primary" />
                ) : (
                  <HeartIcon weight="regular" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-start justify-start p-2 sm:p-4">
        <div className="flex w-full flex-1 items-end justify-start gap-3 text-sm text-slate-600">
          <div className="flex items-center justify-start gap-1">
            <ClockIcon className="text-base" />
            <p>
              {quiz?.questions_sum_time_limit || 0} {tran("min")}
            </p>
          </div>

          <div className="flex items-center justify-start gap-1">
            <MedalIcon className="text-base" />
            <p>
              {quiz?.questions_count || 10} {tran("Q.")}
            </p>
          </div>
          {quiz?.has_level && (
            <div className="flex items-center justify-start gap-1">
              <ChartBarIcon className="text-base" />
              <p>
                {quiz?.question_levels_count} {tran("Levels")}
              </p>
            </div>
          )}
        </div>
        <h5 className="heading-5 pt-3">
          {textTrim(tran(quiz?.translation?.title), 34)}
        </h5>

        <div
          className={`flex w-full gap-2 pt-4 pb-6 ${quiz?.is_favorite ? "max-xl:flex-col" : "max-sm:flex-col"}`}
        >
          {quiz?.user_quizzes_count && quiz?.user_quizzes_count > 3 ? (
            <div className="bg-primary/10 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-medium text-slate-600">
              <div className="flex items-center justify-start">
                {quiz?.user_quizzes?.map((quiz_user: any) => (
                  <div
                    key={quiz_user?.id}
                    className="relative z-10 rounded-full bg-white p-0.5"
                  >
                    <ImageLoader
                      src={quiz_user?.user?.avatar}
                      alt="avatar"
                      height={24}
                      width={24}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
              {"+ " + (quiz?.user_quizzes_count - 3) + " More"}
            </div>
          ) : (
            ""
          )}
          <QuizEnrolElement quiz={quiz} />
        </div>

        <div
          className={`flex w-full items-center justify-between gap-3 max-[400px]:flex-col ${quiz?.is_favorite ? "md:max-lg:flex-col" : ""}`}
        >
          {(quiz?.taken_status === null || !quiz?.taken_status) && (
            <Button onClick={() => setModal(true)} className="block w-full">
              <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                {tran("Start Quiz")} <ArrowRightIcon className="" />{" "}
              </span>
            </Button>
          )}

          {quiz?.taken_status === "pending" &&
            (quiz?.has_level ? (
              <Button
                href={`/quizzes/${quiz?.translation?.slug}?tab=1`}
                className="block w-full"
                variant="primary-outline"
              >
                <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                  {tran("Go To Levels")} <ArrowRightIcon className="" />{" "}
                </span>
              </Button>
            ) : (
              <Button
                href={`/play/quiz?quiz=${quiz?.translation?.slug}`}
                className="block w-full"
                variant="primary-outline"
              >
                <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                  {tran("Play Now")} <ArrowRightIcon className="" />{" "}
                </span>
              </Button>
            ))}

          {quiz?.taken_status === "completed" &&
            (quiz?.has_level ? (
              <Button
                href={`/quizzes/${quiz?.translation?.slug}?tab=1`}
                className="block w-full"
                variant="secondary-outline"
              >
                <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                  {tran("View Result")} <ArrowRightIcon className="" />{" "}
                </span>
              </Button>
            ) : (
              <Button
                href={`/result/quiz?quiz=${quiz?.translation?.slug}`}
                className="block w-full"
                variant="secondary-outline"
              >
                <span className="flex items-center justify-center gap-2 max-lg:text-sm">
                  {tran("View Result")} <ArrowRightIcon className="" />{" "}
                </span>
              </Button>
            ))}
          <Button
            href={`/quizzes/${quiz?.translation?.slug}`}
            className="block w-full"
            variant="secondary"
          >
            <span className="flex items-center justify-center gap-2 max-lg:text-sm">
              {tran("View Details")} <ArrowRightIcon className="" />{" "}
            </span>
          </Button>
        </div>
      </div>
      <QuizAssignModal
        showModal={modal}
        setShowModal={setModal}
        quizDetails={quiz}
        refetch={refetch}
        modalRef={modalRef}
      />
    </div>
  );
}

const QuizEnrolElement = ({ quiz }: { quiz: QuizType }) => {
  const { tran } = useTranslations();
  const enrolled = (
    <div className="text-primary flex items-center justify-start gap-1 text-lg">
      {tran("Joined")}{" "}
    </div>
  );
  const not_enrolled = (
    <React.Fragment>
      {tran("Joining Fee")}:
      <div className="text-primary flex items-center justify-start gap-1 text-lg">
        {quiz?.is_free ? (
          "Free"
        ) : (
          <>
            {quiz?.point_to_pass}
            <CoinsIcon />
          </>
        )}
      </div>
    </React.Fragment>
  );
  return (
    <div className="bg-primary/10 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-medium text-slate-600">
      {quiz?.taken_status ? enrolled : not_enrolled}
    </div>
  );
};
