/** @format */
"use client";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { InputGroup } from "@/components/ui/InputGroup";
import { InputValidationMessage } from "@/components/ui/InputValidationMessage";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { getQueryClient } from "@/configs/query-client";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import { SupportTicketType } from "@/types/support";
import { ArrowUUpLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const priorities = ["high", "medium", "low"] as const;
export type SupportFormType = {
  subject?: string;
  message: string;
  attachments: File[] | null;
  priority: "low" | "medium" | "high";
};
type Props = {
  ticket: SupportTicketType | null;
  setShowSection: React.Dispatch<
    React.SetStateAction<"tickets" | "create-ticket">
  >;
  setTicket: React.Dispatch<React.SetStateAction<SupportTicketType | null>>;
};
export default function CreateTicket({
  setShowSection,
  ticket,
  setTicket,
}: Props) {
  const { tran } = useTranslations();
  const [supportForm, setSupportForm] = useState<SupportFormType>({
    subject: "",
    message: "",
    attachments: null,
    priority: "high",
  });

  useEffect(() => {
    if (ticket) {
      setSupportForm({
        subject: ticket.subject,
        message: ticket.message,
        attachments: null,
        priority: ticket.priority,
      });
    } else {
      setSupportForm({
        subject: "",
        message: "",
        attachments: null,
        priority: "high",
      });
    }
  }, [ticket]);

  const {
    mutate,
    isLoading,
    backendErrors: errors,
  } = useQueryMutation({
    url: `profile/support-tickets${ticket ? `/${ticket?.ticket_no}` : ""}`,
  });

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData: any = supportForm;
    if (ticket) {
      formData = {
        ...supportForm,
        _method: "PUT",
      };
    }
    mutate(formData, {
      onSuccess: (response: any) => {
        toast.success(response?.data?.message);
        setSupportForm({
          subject: "",
          message: "",
          attachments: null,
          priority: "high",
        });

        setShowSection("tickets");

        getQueryClient().invalidateQueries({
          queryKey: ["support-tickets"],
          exact: false,
        });
      },
    });
  };
  return (
    <>
      <div className="border-primary/10 flex items-center justify-between gap-3 border-b pb-6 max-[400px]:flex-col max-[400px]:items-start">
        <h3 className="heading-3 !font-medium">
          {tran(ticket ? "Update Ticket" : "Create Ticket")}
        </h3>
        <Button
          onClick={() => {
            setShowSection("tickets");
            setTicket(null);
          }}
          variant="primary-outline"
          size="sm"
          className="flex items-center justify-center gap-2"
        >
          <ArrowUUpLeftIcon /> {tran("Go Back")}
        </Button>
      </div>
      <form
        onSubmit={handleSendMessage}
        className="grid grid-cols-12 gap-4 pt-6 sm:gap-6"
      >
        <div className="col-span-12 sm:col-span-6">
          <InputGroup
            label={tran("Subject")}
            type="text"
            name="subject"
            required={true}
            value={supportForm.subject}
            errors={errors}
            onChange={(e) =>
              setSupportForm((prev) => ({
                ...prev,
                subject: e,
              }))
            }
            placeholder="Subject"
          />
        </div>
        <div className="relative col-span-12 flex w-full flex-1 flex-col items-start justify-start gap-2 sm:col-span-6">
          <Label
            title={tran("Select Priority")}
            name="priority"
            required={true}
          />
          <Select
            name="priority"
            value={supportForm.priority}
            options={priorities.map((priority) => ({
              label: priority,
              value: priority,
            }))}
            onChange={(value) =>
              setSupportForm((prev) => ({
                ...prev,
                priority: value as any,
              }))
            }
          />
          <InputValidationMessage message={errors?.priority} />
        </div>

        <div className="col-span-12 flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-between gap-3">
            <Label
              title={tran("Describe your message")}
              name="message"
              required={true}
            />
            <p className="text-xs text-slate-500">
              {supportForm.message.length}/1000
            </p>
          </div>
          <TextArea
            placeholder={tran("Type your message here...")}
            value={supportForm.message}
            name="message"
            validationError={errors?.message}
            onChange={(value) =>
              setSupportForm({
                ...supportForm,
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
            value={supportForm.attachments}
            onChange={(e) => {
              setSupportForm((prev) => ({
                ...prev,
                attachments: e,
              }));
            }}
          />
          <InputValidationMessage message={errors?.attachments} />
        </div>
        <div className="col-span-12 w-full">
          <Button type="submit" loading={isLoading} className="w-full">
            {tran("Submit now")}
          </Button>
        </div>
      </form>
    </>
  );
}
