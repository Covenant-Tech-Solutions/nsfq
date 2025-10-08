/** @format */
"use client";
import ImageLoader from "@/components/ui/ImageLoader";
import { SupportTicketReply } from "@/types/support";
import moment from "moment";
import React from "react";
import FilePreview from "./FilePreview";
import { sanitizeText } from "@/utils/helper";

type Props = {
  tran: (text: string) => string;
  replies: SupportTicketReply[] | undefined;
};

const Replies: React.FC<Props> = ({ tran, replies }) => {
  const isReplyFromUser = (replyType: string): boolean =>
    replyType === "App\\Models\\User";
  return (
    <div className="">
      <h4 className="heading-4 pt-6">{tran("Replies")}</h4>
      <div className="flex flex-col">
        {replies?.length ? (
          replies.map((item: any, index: number) => (
            <div
              key={index}
              className="border-primary/10 mt-3 rounded-xl border bg-white"
            >
              <div className="border-primary/10 flex items-center justify-between gap-2 border-b px-2 py-1">
                <div className="flex items-center gap-2">
                  <ImageLoader
                    src={item?.reply?.avatar}
                    user={item?.reply}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="h-8 w-8 rounded-full"
                  />
                  <p className="text-sm">
                    {isReplyFromUser(item?.reply_type)
                      ? tran("Me")
                      : tran("Staff")}
                  </p>
                </div>
                <p className="text-sm text-slate-500">
                  {moment(item?.created_at).format("DD MMM, YYYY hh:mm A")}
                </p>
              </div>

              <p
                className="p-2 text-slate-500 xl:p-4"
                dangerouslySetInnerHTML={{
                  __html: sanitizeText(item?.message),
                }}
              ></p>

              {item?.attachments?.length > 0 && (
                <div className="p-2 xl:p-4">
                  <p className="mb-2 text-sm font-medium">
                    {tran("Attachments")}:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {item.attachments.map((item: string, index: number) => (
                      <FilePreview key={index} item={item} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="p-4">{tran("No replies")}</p>
        )}
      </div>
    </div>
  );
};

export default Replies;
