/** @format */
"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useListParams } from "@/hooks/useListParams";
import { QuizPaginationApiResponse } from "@/types/quiz";
import { getToken } from "@/utils";
import dynamic from "next/dynamic";
import React, { memo } from "react";
import Categories from "../contests/Categories";
import SearchField from "./SearchField";

const Skeleton = dynamic(() => import("@/components/ui/QuizItemSkeleton"), {
  ssr: false,
});

const QuizItems = dynamic(() => import("./QuizItems"), {
  ssr: false,
});

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

const PER_PAGE_ITEM = 9;

const QuizList = () => {
  const token = getToken();

  const {
    page,
    category,
    searchText,
    debouncedSearchText,
    handlePageChange,
    handleCategoryChange,
    handleSearchChange,
  } = useListParams({ baseUrl: "/quizzes" });

  const {
    data: quizList,
    refetch,
    isLoading: isQuizListLoading,
  } = useGetQuery<QuizPaginationApiResponse>({
    isPublic: !token,
    url: "/quizzes",
    queryKey: "quizzes",
    params: {
      page: page,
      per_page: PER_PAGE_ITEM,
      search: debouncedSearchText,
      category: category,
    },
  });

  return (
    <React.Fragment>
      <div className="pt-6">
        <SearchField
          searchText={searchText}
          setSearchText={handleSearchChange}
        />
      </div>
      <Categories setSelectedCategory={handleCategoryChange} />

      {isQuizListLoading ? (
        <Skeleton total={3} />
      ) : (
        <QuizItems quizList={quizList} refetch={refetch} />
      )}

      <Pagination
        currentPage={page}
        lastPage={quizList?.last_page ?? 1}
        onPageChange={handlePageChange}
      />
    </React.Fragment>
  );
};

export default memo(QuizList);
