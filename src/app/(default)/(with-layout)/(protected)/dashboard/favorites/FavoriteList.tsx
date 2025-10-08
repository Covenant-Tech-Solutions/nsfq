/** @format */

import ContestCard from "@/app/(default)/(with-layout)/contests/ContestCard";
import QuizListItem from "@/app/(default)/(with-layout)/quizzes/QuizListItem";
import DataNotFound from "@/components/ui/DataNotFound";
import Skeleton from "@/components/ui/QuizItemSkeleton";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestType } from "@/types/contest";
import { QuizType } from "@/types/quiz";
import React from "react";
type Props = {
  tab: "quiz" | "contest";
  isLoading: boolean;
  favorites: QuizType[] | ContestType[];
  refetch: () => void;
};
const FavoriteList: React.FC<Props> = ({
  tab,
  isLoading,
  favorites,
  refetch,
}) => {
  const { tran } = useTranslations();
  if (isLoading) {
    return (
      <Skeleton
        className="col-span-2 grid w-full grid-cols-12 gap-4 overflow-hidden"
        total={3}
      />
    );
  }

  if (!favorites?.length) {
    return (
      <DataNotFound
        imageSrc="/not-found-favorites.png"
        title={tran("No Favorites Found")}
        message={tran("The favorites you are looking for does not exist.")}
      />
    );
  }

  return (
    <div className="col-span-2 grid w-full grid-cols-12 gap-4 overflow-hidden">
      {favorites.map((item) => (
        <div key={item?.id} className="col-span-12 md:col-span-6">
          {tab === "quiz" ? (
            <QuizListItem
              quiz={item as QuizType}
              refetch={refetch}
              isFavorite={true}
            />
          ) : (
            <ContestCard
              contest={item as ContestType}
              isFavorite={true}
              refetch={refetch}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FavoriteList;
