// ============================================================
// Generic API Response Types
// ============================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

/**
 * API error response shape
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Generic query params for list endpoints
 */
export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
}
