/** @format */

import { Button } from "@/components/ui/Button";
import NotFoundTableData from "@/components/ui/NotFoundTableData";
import {
  Table as CustomTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SupportTicketType } from "@/types/support";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import React from "react";
import SupportTicketsTableSkeleton from "./SupportTicketsTableSkeleton";
import {
  EyeIcon,
  PencilIcon,
  TicketIcon,
} from "@phosphor-icons/react/dist/ssr";
type Props = {
  isLoading: boolean;
  tickets: SupportTicketType[];
  tran: (text: string) => string;
  setShowSection: React.Dispatch<
    React.SetStateAction<"tickets" | "create-ticket">
  >;
  setTicket: React.Dispatch<React.SetStateAction<SupportTicketType | null>>;
};
const Table: React.FC<Props> = ({
  isLoading,
  tickets,
  tran,
  setShowSection,
  setTicket,
}) => {
  return (
    <>
      <div className="border-primary/10 flex items-center justify-between gap-3 border-b pb-6 max-[400px]:flex-col max-[400px]:items-start">
        <h3 className="heading-3 !font-medium">{tran("Support Tickets")}</h3>
        <Button
          onClick={() => {
            setShowSection("create-ticket");
            setTicket(null);
          }}
          size="sm"
          className="flex items-center justify-center gap-2"
        >
          + {tran("Create Ticket")}
        </Button>
      </div>
      <div>
        {isLoading ? (
          <SupportTicketsTableSkeleton />
        ) : (
          <div className="overflow-hidden rounded-lg bg-white">
            <CustomTable>
              <TableHeader>
                <TableRow>
                  <TableHead>{tran("Ticket No")}</TableHead>
                  <TableHead>{tran("Subject")}</TableHead>
                  <TableHead>{tran("Created At")}</TableHead>
                  <TableHead>{tran("Status")}</TableHead>
                  <TableHead>{tran("Priority")}</TableHead>
                  <TableHead>{tran("Action")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tickets.map((item) => (
                  <TableRow key={item?.id}>
                    <TableCell>
                      <span>#{item?.ticket_no}</span>
                    </TableCell>
                    <TableCell>{item?.subject}</TableCell>
                    <TableCell>
                      {moment(item?.created_at).format("DD MMM, YYYY")}{" "}
                    </TableCell>
                    <TableCell>
                      <p className="bg-primary/10 text-primary rounded-full text-center text-sm font-medium capitalize">
                        {item?.status}
                      </p>
                    </TableCell>
                    <TableCell
                      className={clsx(
                        "relative text-sm font-medium capitalize",

                        {
                          "text-red-500 before:bg-red-500":
                            item?.priority === "high",
                          "text-yellow-500 before:bg-yellow-500":
                            item?.priority === "medium",
                          "text-green-500 before:bg-green-500":
                            item?.priority === "low",
                        },
                      )}
                    >
                      {item?.priority}
                    </TableCell>
                    <TableCell className="flex flex-row gap-3">
                      <Link
                        href={`/dashboard/supports/${item?.ticket_no}`}
                        className="text-primary flex items-center justify-start gap-1 text-lg duration-300 hover:underline"
                      >
                        <EyeIcon />
                      </Link>
                      <Button
                        onClick={() => {
                          setTicket(item);
                          setShowSection("create-ticket");
                        }}
                      >
                        <PencilIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </CustomTable>

            {tickets.length === 0 && (
              <NotFoundTableData
                icon={TicketIcon}
                text="No Support Ticket Found"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
