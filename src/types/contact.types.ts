// ============================================================
// Contact Us & Tickets System Types
// ============================================================

export type ContactThreadStatus = "pending_admin" | "pending_user" | "closed" | string;

export interface ContactMessage {
  id: number;
  thread_id: number;
  sender_type: string;
  sender_id: number;
  sender_name: string;
  is_from_admin: boolean;
  message: string;
  file?: string | null;
  file_url?: string | null;
  read_at: string | null;
  created_at: string;
}

export interface ContactThread {
  id: number;
  user_id: number;
  subject: string;
  status: ContactThreadStatus;
  status_label: string;
  last_replied_at: string | null;
  created_at: string;
  updated_at: string;
  last_message?: ContactMessage | null;
  messages?: ContactMessage[];
}

export interface ContactThreadsData {
  data: ContactThread[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links?: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface CreateContactThreadPayload {
  subject: string;
  message: string;
  file?: File | null;
}

export interface ReplyContactThreadPayload {
  threadId: number | string;
  message: string;
  file?: File | null;
}
