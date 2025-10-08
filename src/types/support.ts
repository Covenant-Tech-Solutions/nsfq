/** @format */

import { PaginationData } from "./pagination";

export interface SupportTicketApiResponse extends PaginationData {
  data: SupportTicketType[];
}

export interface SupportTicketType {
  id: number;
  user_id: number;
  ticket_no: string;
  subject: string;
  message: string;
  attachments: string[];
  status: "open" | "closed" | "pending";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export type SupportTicketReply = {
  id: number;
  support_ticket_id: number;
  reply_type: string;
  reply_id: number;
  message: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
  reply: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    full_name: string;
  };
};

export interface SingleSupportTicket extends SupportTicketType {
  replies?: SupportTicketReply[];
}
