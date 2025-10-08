/** @format */
"use client";
import Pagination from "@/components/ui/Pagination";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useListParams } from "@/hooks/useListParams";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestApiResponse } from "@/types/contest";
import { getToken } from "@/utils";
import dynamic from "next/dynamic";
import React, { memo } from "react";
import SearchField from "../quizzes/SearchField";
import CategoryItems from "./Categories";

const Skeleton = dynamic(() => import("@/components/ui/QuizItemSkeleton"), {
  ssr: false,
});

const Contests = dynamic(() => import("./Contests"), { ssr: false });

const PER_PAGE_ITEM = 9;

const ContestList = () => {
  const token = getToken();
  const { tran } = useTranslations();

  const {
    page,
    category,
    searchText,
    debouncedSearchText,
    handlePageChange,
    handleCategoryChange,
    handleSearchChange,
  } = useListParams({ baseUrl: "/contests" });

  const {
    data: contests,
    isLoading,
    refetch,
  } = useGetQuery<ContestApiResponse>({
    isPublic: !token,
    url: "get-contests",
    queryKey: "contests",
    params: {
      page: page,
      per_page: PER_PAGE_ITEM,
      search: debouncedSearchText,
      category: category,
      sort_column: "start_time",
      sort_by: "asc",
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
      <CategoryItems setSelectedCategory={handleCategoryChange} />
      <div className="pt-8">
        <div className="">
          <h3 className="heading-3">{tran("Current Contests")}</h3>
          {isLoading ? (
            <Skeleton total={9} />
          ) : (
            <Contests contests={contests} refetch={refetch} />
          )}
        </div>
      </div>
      <Pagination
        currentPage={page}
        lastPage={contests?.last_page ?? 1}
        onPageChange={handlePageChange}
      />
    </React.Fragment>
  );
};

export default memo(ContestList);
