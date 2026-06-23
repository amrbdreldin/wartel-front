// ============================================================
// Parent Types
// ============================================================

export interface ChildCard {
  id: string;
  name: string;
  age: number;
  group_name: string;
  active_notifications: number;
  avatar?: string;
}

export interface ParentDashboard {
  children: ChildCard[];
}

export interface RegisterChildRequest {
  full_name: string;
  age: number;
  preferred_session_time?: string;
}
