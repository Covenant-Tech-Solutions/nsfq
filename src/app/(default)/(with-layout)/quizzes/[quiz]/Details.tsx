/** @format */

"use client";
import ImageLoader from "@/components/ui/ImageLoader";
import ShareLinks from "@/components/ui/ShareLinks";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import useClickOutside from "@/hooks/useClickOutside";
import { useTranslations } from "@/providers/TranslationProviders";
import { QuizType } from "@/types/quiz";
import { getToken } from "@/utils";
import {
  ClockIcon,
  CoinIcon,
  MedalIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Overview from "./Overview";
import PlayButtons from "./PlayButtons";

const QuizAssignModal = dynamic(() => import("../QuizAssignModal"), {
  ssr: false,
});

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

const PageNotFound = dynamic(() => import("@/components/ui/PageNotFound"), {
  ssr: false,
});

export default function QuizDetails({ quiz }: { quiz: string }) {
  const token = getToken();
  const { tran } = useTranslations();
  const { modalRef, modal, setModal } = useClickOutside();

  const {
    data: quizDetails,
    isLoading: isQuizListLoading,
    refetch,
  } = useGetQuery<QuizType>({
    isPublic: !token,
    url: `quiz-details/${quiz}`,
    queryKey: ["quiz-details", quiz],
  });

  if (isQuizListLoading) return <Loader />;

  if (!quizDetails) return <PageNotFound />;

  return (
    <div className="custom-container pt-20 sm:pt-28">
      <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
        <div className="flex h-[300px] w-full items-center justify-center rounded-sm bg-gray-300 dark:bg-gray-700">
          {quizDetails?.banner_image ? (
            <ImageLoader
              src={quizDetails?.banner_image}
              width={1920}
              height={300}
              alt={quizDetails?.translation?.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-200 dark:text-gray-600"
              width="40"
              height="40"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26" />
                <path d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32" />
                <path d="m21.5 16.5l-4 3.991m0-3.982l4 3.991" />
              </g>
            </svg>
          )}
        </div>

        <div className="absolute inset-0 flex flex-col items-start justify-end bg-black/40 p-6 text-white">
          <h2 className="heading-2">{quizDetails?.translation?.title}</h2>
          <div className="flex flex-wrap items-center justify-start gap-3 pt-1">
            <div className="flex items-center justify-start gap-1">
              <ClockIcon className="text-base" />
              <p>
                {quizDetails?.questions_sum_time_limit} {tran("min")}
              </p>
            </div>
            <div className="flex items-center justify-start gap-1">
              <UsersIcon className="text-base" />
              <p>
                {quizDetails?.user_quizzes_count} {tran("players")}
              </p>
            </div>
            <div className="flex items-center justify-start gap-1">
              <MedalIcon className="text-base" />
              <p>
                {quizDetails?.questions_count} {tran("questions")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <div className="grid grid-cols-12 gap-6">
          <Overview quizDetails={quizDetails} />
          <div className="border-primary/20 col-span-12 h-fit rounded-xl border p-6 lg:col-span-4">
            <div className="grid grid-cols-2 gap-3 pb-4">
              <div className="border-primary/20 rounded-lg border p-4">
                <p className="pb-2 text-sm">{tran("Category")}</p>
                <p className="font-medium capitalize">
                  {quizDetails?.category.title}
                </p>
              </div>
              <div className="border-primary/20 rounded-lg border p-4">
                <p className="pb-2 text-sm">{tran("Duration")}</p>
                <p className="font-medium">
                  {quizDetails?.questions_sum_time_limit} {tran("min")}
                </p>
              </div>
              <div className="border-primary/20 rounded-lg border p-4">
                <p className="pb-2 text-sm">{tran("Questions")}</p>
                <p className="font-medium">{quizDetails?.questions_count}</p>
              </div>
              <div className="border-primary/20 text-primary rounded-lg border p-4">
                <p className="pb-2 text-sm font-medium">{tran("Enroll fee")}</p>
                <p className="flex items-center justify-start gap-2 font-medium">
                  <CoinIcon />{" "}
                  {quizDetails?.is_free ? "Free" : quizDetails?.point_to_pass}
                </p>
              </div>
            </div>
            <PlayButtons
              quiz={quizDetails}
              setShowModal={setModal}
              tran={tran}
            />
            <ShareLinks
              link={`${window.location.origin}/quizzes/${quiz}`}
              text={`${quizDetails?.translation?.title}`}
            />
          </div>
        </div>
      </div>
      <QuizAssignModal
        showModal={modal}
        setShowModal={setModal}
        quizDetails={quizDetails}
        refetch={refetch}
        modalRef={modalRef}
      />
    </div>
  );
}
