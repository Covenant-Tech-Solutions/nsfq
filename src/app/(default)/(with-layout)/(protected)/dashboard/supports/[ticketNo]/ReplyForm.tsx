/** @format */
"use client";
import { Button } from "@/components/ui/Button";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";
import { InputValidationMessage } from "@/components/ui/InputValidationMessage";
import { FileUpload } from "@/components/ui/FileUpload";
import { SupportFormType } from "../CreateTicket";
type Props = {
  ticketNumber: string;
  tran: (text: string) => string;
  refetch: () => void;
};
const ReplyForm: React.FC<Props> = ({ ticketNumber, tran, refetch }) => {
  const [replyForm, setReplyForm] = useState<SupportFormType>({
    message: "",
    attachments: null,
    priority: "high",
  });

  const {
    mutate,
    isLoading: replyLoading,
    backendErrors: errors,
  } = useQueryMutation({
    url: `profile/reply-to-support-ticket/${ticketNumber}`,
  });

  const handleReplyMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(replyForm, {
      onSuccess: (response: any) => {
        toast.success(tran(response?.data?.message));
        setReplyForm({
          message: "",
          attachments: null,
          priority: "high",
        });
        refetch();
      },
    });
  };
  return (
    <form
      onSubmit={handleReplyMessage}
      className="grid grid-cols-12 gap-6 pt-6"
    >
      <div className="col-span-12 flex flex-col items-start justify-start gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label
            title={tran("Describe your message")}
            name="message"
            required={true}
          />
          <p className="text-xs text-slate-500">
            {replyForm.message.length}/1000
          </p>
        </div>
        <TextArea
          placeholder={tran("Type your message here...")}
          value={replyForm.message}
          name="message"
          validationError={errors?.message}
          onChange={(value) =>
            setReplyForm({
              ...replyForm,
              message: value,
            })
          }
          className="border-primary/20 min-h-40 w-full rounded-md border bg-white px-3 py-2 outline-none max-sm:text-sm sm:px-4 sm:py-3"
        />
        <InputValidationMessage message={errors?.message} />
      </div>
      <div className="col-span-12 flex flex-col items-start justify-start gap-3">
        <Label title={tran("Attachments")} name="attachments" />
        <FileUpload
          name="attachments"
          placeholder="Choose File"
          value={replyForm.attachments}
          onChange={(e) => {
            setReplyForm((prev) => ({
              ...prev,
              attachments: e,
            }));
          }}
        />
        <InputValidationMessage message={errors?.attachments} />
      </div>
      <div className="col-span-12 w-full">
        <Button type="submit" loading={replyLoading} className="w-full">
          {tran("Submit now")}
        </Button>
      </div>
    </form>
  );
};

export default ReplyForm;
