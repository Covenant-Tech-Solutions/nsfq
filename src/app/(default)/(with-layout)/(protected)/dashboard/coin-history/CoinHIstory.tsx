/** @format */

"use client";
import DataNotFound from "@/components/ui/DataNotFound";
import Loader from "@/components/ui/Loader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import { CoinsIcon } from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

const CoinHistory = () => {
  const { tran } = useTranslations();
  const { push } = useRouter();
  const [page, setPage] = useState(1);
  const { data: coinHistories, isLoading } = useGetQuery({
    url: `profile/coin-logs`,
    queryKey: "coin-history",
    params: {
      page,
      per_page: 10,
    },
  });
  const handlePageChange = (page: number) => {
    setPage(page);
    push(`/dashboard/coin-history?page=${page}`);
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-primary/5 rounded-xl p-6">
      <h3 className="heading-3 !font-medium">{tran("Coin History")}</h3>
      <div className="flex flex-col gap-3 pt-6">
        {!coinHistories?.data?.length && (
          <DataNotFound
            title="No Coin History Found"
            message="The coin history you are looking for does not exist."
            imageSize="sm"
          />
        )}
        {coinHistories?.data?.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-white p-4"
          >
            <div className="flex items-center justify-start gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-xl">
                <CoinsIcon className="text-xl" />
              </div>
              <div className="">
                <p className="text-xl font-medium">
                  {item.coins} {tran("Coins")}
                </p>
                <p className="text-sm text-slate-500">
                  {moment(item.created_at).format("DD MMM, YYYY")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <p
                className={`text-sm ${item?.type === "+" ? "text-green-500" : "text-red-500"}`}
              >
                {item?.type}
                {item.coins}
              </p>
            </div>
          </div>
        ))}
        {coinHistories?.data?.length > 0 && (
          <Pagination
            currentPage={coinHistories?.current_page || 1}
            lastPage={coinHistories?.last_page || 1}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CoinHistory;
