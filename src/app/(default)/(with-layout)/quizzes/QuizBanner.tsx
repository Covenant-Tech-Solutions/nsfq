"use client";
import quizBanner from "@/../public/quiz-banner-1.png";
import ImageLoader from "@/components/ui/ImageLoader";
import NextContest from "../contests/NextContest";
import { cn } from "@/utils/cn";
import { useTranslations } from "@/providers/TranslationProviders";

interface QuizBannerProps {
  image?: string;
  title: string;
  subtitle: string;
  contestBanner?: boolean;
  nextContest?: boolean;
}

const QuizBanner = ({
  image,
  title,
  subtitle,
  nextContest,
}: QuizBannerProps) => {
  const { tran } = useTranslations();
  return (
    <div className="relative z-30 overflow-hidden rounded-xl max-lg:before:absolute max-lg:before:inset-0 max-lg:before:z-20 max-lg:before:bg-black/30">
      <ImageLoader
        src={image || quizBanner}
        alt="quiz banner"
        width={1296}
        height={250}
        className={cn(
          "inset-0 z-0 h-full max-h-[250px] min-h-[200px] w-full rounded-xl object-cover md:min-h-[250px]",
          nextContest && "min-h-[300px]",
        )}
      />

      <div className="absolute inset-0 z-40 flex justify-between gap-2 p-6 max-md:flex-col max-md:justify-center sm:p-10 md:items-center">
        <div className="hidden heading-1">
          <p className="hidden max-w-[550px] leading-[110%] text-white uppercase">
            {tran(title)}
          </p>
          <span className="hidden heading-5 leading-[110%] !font-normal text-white">
            {tran(subtitle)}
          </span>
        </div>
        {nextContest && <NextContest />}
      </div>
    </div>
  );
};

export default QuizBanner;
