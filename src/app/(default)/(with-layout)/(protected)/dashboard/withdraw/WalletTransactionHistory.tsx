/** @format */

import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import dynamic from "next/dynamic";
import { useState } from "react";

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

const WithdrawTable = dynamic(() => import("./WithdrawTable"), {
  ssr: false,
});

const WithdrawSection = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetQuery({
    url: `profile/withdraws?page=${page}`,
    queryKey: ["withdraws", page],
  });

  const withdrawals = data?.data ?? [];

  return (
    <>
      <WithdrawTable isLoading={isLoading} data={withdrawals} />
      {data?.last_page > 1 && (
        <Pagination
          currentPage={data.current_page}
          lastPage={data.last_page}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default WithdrawSection;
