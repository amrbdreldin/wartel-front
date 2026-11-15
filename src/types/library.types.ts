// ============================================================
// Public Library Types
// ============================================================

export interface LibraryNamedRef {
  id: number;
  name: string;
}

export interface PublicLibraryItem {
  resource_id: number;
  title: string;
  content_type_id: number | null;
  content_type_name: string | null;
  resource_url: string;
  created_at: string | null;
  course: LibraryNamedRef | null;
  track: LibraryNamedRef | null;
}

export interface PublicLibraryPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PublicLibraryFilters {
  content_types: LibraryNamedRef[];
  tracks: LibraryNamedRef[];
  courses: LibraryNamedRef[];
}

export interface PublicLibraryResponseData {
  items: PublicLibraryItem[];
  pagination: PublicLibraryPagination;
  filters: PublicLibraryFilters;
}

export interface GetPublicLibraryParams {
  track_id?: number | string;
  course_id?: number | string;
  content_type_id?: number | string;
  search?: string;
  per_page?: number;
  page?: number;
}
