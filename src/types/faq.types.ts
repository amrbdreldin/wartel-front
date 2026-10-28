// ============================================================
// FAQ Types
// ============================================================

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export interface FaqCategory {
  id: number;
  name: string;
  data: FaqItem[];
}
