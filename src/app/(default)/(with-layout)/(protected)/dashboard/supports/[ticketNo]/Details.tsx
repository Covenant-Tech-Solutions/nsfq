/** @format */
"use client";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import { SingleSupportTicket } from "@/types/support";
import { sanitizeText } from "@/utils/helper";
import { ArrowUUpLeftIcon } from "@phosphor-icons/react/dist/ssr";
import FilePreview from "./FilePreview";
import Replies from "./Replies";
import ReplyForm from "./ReplyForm";
import moment from "moment";

type Props = {
  ticketNumber: string;
};
export default function TicketDetails({ ticketNumber }: Props) {
  const { tran } = useTranslations();

  const {
    data: ticket,
    isLoading,
    refetch,
  } = useGetQuery<SingleSupportTicket>({
    url: `profile/support-tickets/${ticketNumber}`,
    queryKey: "support-tickets",
    enabled: !!ticketNumber,
  });
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="bg-primary/5 rounded-xl p-6">
      <div className="border-primary/10 flex flex-wrap items-start justify-between gap-4 border-b pb-2 sm:flex-nowrap">
        <p className="text-sm text-slate-500">#{ticket?.ticket_no}</p>
        <Button
          href="/dashboard/supports"
          className="bg-primary flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white"
        >
          <ArrowUUpLeftIcon /> {tran("Go Back")}
        </Button>
      </div>

      <div className="border-primary/10 mt-3 rounded-xl border bg-white p-2">
        <div className="border-primary/10 flex items-center justify-between gap-2 border-b px-2 py-1">
          <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">
            {ticket?.subject}
          </h3>
          {ticket?.created_at && (
            <p className="text-sm text-slate-500">
              {tran("Created at")}:{" "}
              {moment(ticket.created_at).format("DD MMM, YYYY hh:mm A")}
            </p>
          )}
        </div>
        <div
          className="p-2 text-slate-500 xl:p-4"
          dangerouslySetInnerHTML={{ __html: sanitizeText(ticket?.message) }}
        ></div>

        <div>
          <p className="text-base font-medium text-slate-800">
            {tran("Attachments")}
          </p>

          {ticket?.attachments && ticket.attachments.length > 0 ? (
            <div className="flex flex-wrap gap-4 pt-3">
              {ticket.attachments.map((item: string, index: number) => (
                <FilePreview key={index} item={item} index={index} />
              ))}
            </div>
          ) : (
            <p className="pt-2 text-slate-500">{tran("No attachments")}</p>
          )}
        </div>
      </div>

      <Replies tran={tran} replies={ticket?.replies} />
      {/* reply form */}
      <ReplyForm ticketNumber={ticketNumber} tran={tran} refetch={refetch} />
    </div>
  );
}
