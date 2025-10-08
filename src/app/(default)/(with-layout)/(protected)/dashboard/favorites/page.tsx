/** @format */

"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import { FavoritesApiResponse } from "@/types/quiz";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

const FavoriteList = dynamic(() => import("./FavoriteList"), {
  ssr: false,
});

export default function Favorites() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("quiz");
  const { push } = useRouter();
  const { tran } = useTranslations();
  const {
    data: favorites,
    refetch,
    isLoading,
  } = useGetQuery<FavoritesApiResponse>({
    url: `profile/favorites`,
    queryKey: "favorites",
    params: {
      page,
      per_page: 4,
      type: tab,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [tab]);

  const handlePageChange = (page: number) => {
    setPage(page);
    push(`/user/favorites?page=${page}`);
  };

  return (
    <div className="bg-primary/5 rounded-xl p-2 sm:p-6">
      <h3 className="heading-3 !font-medium">{tran("Favorites")}</h3>
      <div className="flex items-center justify-between pt-6">
        {["quiz", "contest"].map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setTab(item);
              refetch();
            }}
            className={`${item === tab ? "border-primary text-primary" : "border-slate-300 text-slate-500"} flex-1 border-b-2 py-3 text-xl font-medium capitalize`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 pt-6">
        {tab === "quiz" && (
          <FavoriteList
            favorites={favorites?.data || []}
            refetch={refetch}
            isLoading={isLoading}
            tab={tab}
          />
        )}

        {tab === "contest" && (
          <FavoriteList
            favorites={favorites?.data || []}
            refetch={refetch}
            isLoading={isLoading}
            tab={tab}
          />
        )}
        <Pagination
          currentPage={page}
          lastPage={favorites?.last_page || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
