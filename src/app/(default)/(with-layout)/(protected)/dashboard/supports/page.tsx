/** @format */

"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import { SingleSupportTicket, SupportTicketApiResponse } from "@/types/support";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Table = dynamic(() => import("./Table"), {
  ssr: false,
});

const CreateTicket = dynamic(() => import("./CreateTicket"), {
  ssr: false,
});

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

export default function SupportPage() {
  const { tran } = useTranslations();
  const { push } = useRouter();
  const [ticket, setTicket] = useState<SingleSupportTicket | null>(null);
  const [page, setPage] = useState<number>(1);
  const [showSection, setShowSection] = useState<"tickets" | "create-ticket">(
    "tickets",
  );

  const { data: tickets, isLoading } = useGetQuery<SupportTicketApiResponse>({
    url: `profile/support-tickets`,
    params: { page },
    queryKey: "support-tickets",
  });

  const handlePageChange = (page: number) => {
    setPage(page);
    push(`/user/supports?page=${page}`);
  };

  return (
    <div className="bg-primary/5 rounded-xl p-6">
      {showSection === "tickets" && (
        <React.Fragment>
          <Table
            setTicket={setTicket}
            isLoading={isLoading}
            tickets={tickets?.data || []}
            tran={tran}
            setShowSection={setShowSection}
          />
          <Pagination
            currentPage={page}
            lastPage={tickets?.last_page || 1}
            onPageChange={handlePageChange}
          />
        </React.Fragment>
      )}
      {showSection === "create-ticket" && (
        <CreateTicket
          setTicket={setTicket}
          setShowSection={setShowSection}
          ticket={ticket}
        />
      )}
    </div>
  );
}
