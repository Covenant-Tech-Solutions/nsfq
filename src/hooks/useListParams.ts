import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface UseListParamsOptions {
  baseUrl: string;
  defaultCategory?: string;
  debounceDelay?: number;
}

export const useListParams = ({
  baseUrl,
  defaultCategory = "all",
  debounceDelay = 300,
}: UseListParamsOptions) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || defaultCategory;
  const search = searchParams.get("search") || "";

  const [searchText, setSearchText] = useState<string>(search);
  const debouncedSearchText = useDebounce(searchText, debounceDelay);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      params.set("page", String(newPage));
      params.set("category", category);
      params.set("search", debouncedSearchText);

      push(`${baseUrl}?${params.toString()}`);
    },
    [baseUrl, category, debouncedSearchText, push],
  );

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("category", newCategory);
      params.set("search", debouncedSearchText);

      push(`${baseUrl}?${params.toString()}`);
    },
    [baseUrl, debouncedSearchText, push],
  );

  const handleSearchChange = useCallback(
    (newSearchText: string) => {
      setSearchText(newSearchText);
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("category", category);
      params.set("search", newSearchText);

      push(`${baseUrl}?${params.toString()}`);
    },
    [baseUrl, category, push],
  );

  return {
    // Current state
    page,
    category,
    searchText,
    debouncedSearchText,

    // Handlers
    handlePageChange,
    handleCategoryChange,
    handleSearchChange,
  };
};
