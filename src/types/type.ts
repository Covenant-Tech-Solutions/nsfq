import { PaginationDataTypes } from "@/types";

// Update your types file
export interface NotificationType {
  id: number;
  type: string;
  notifiable_type: string;
  notifiable_id: string;
  data: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponseType extends PaginationDataTypes {
  data: NotificationType[];
}
