/** @format */

"use client";

import Pagination from "@/components/ui/Pagination";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { useState } from "react";
import DepositSummary from "./DepositSummary";
import DepositTable from "./DepositTable";

export default function Deposit() {
  const { tran } = useTranslations();
  const { user } = useAuthStore((state) => state);
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useGetQuery({
    url: `profile/deposits?page=${page}`,
    queryKey: ["deposits", page],
  });

  const deposits = response?.data;

  return (
    <div className="bg-primary/5 rounded-xl p-3 sm:p-6">
      <h3 className="heading-3 !font-medium">{tran("Buy Coins")}</h3>
      <DepositSummary coins={user?.coins} />
      <DepositTable deposits={deposits} isLoading={isLoading} />
      <Pagination
        currentPage={response?.current_page}
        lastPage={response?.last_page}
        onPageChange={setPage}
      />
    </div>
  );
}
