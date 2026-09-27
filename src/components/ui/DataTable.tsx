"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight, AlertCircle, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  thClassName?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  errorText?: string;
  noDataText?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  
  // Search options
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | ((row: T) => string))[];
  
  // Pagination options
  pageSize?: number;
  manualPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  
  // Row click
  onRowClick?: (row: T) => void;
  
  // Styling overrides
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  
  // Extra toolbar actions
  extraControls?: React.ReactNode;

  // Expandable rows
  renderExpandedRow?: (row: T) => React.ReactNode;
  expandedRows?: Record<string | number, boolean>;
  getRowId?: (row: T) => string | number;
}

export function DataTable<T>({
  columns,
  data = [],
  isLoading = false,
  isFetching = false,
  isError = false,
  errorText,
  noDataText,
  title,
  subtitle,
  searchable = false,
  searchPlaceholder,
  searchKeys = [],
  pageSize,
  manualPagination,
  currentPage: propCurrentPage,
  totalPages: propTotalPages,
  totalItems,
  onPageChange,
  onRowClick,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  extraControls,
  renderExpandedRow,
  expandedRows,
  getRowId,
}: DataTableProps<T>) {
  const t = useTranslations();
  
  // State
  const [searchTerm, setSearchTerm] = React.useState("");
  const [internalPage, setInternalPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const isManual = manualPagination || Boolean(onPageChange);
  const activePage = isManual ? (propCurrentPage ?? 1) : internalPage;

  const handlePageChange = (newPage: number) => {
    if (isManual) {
      onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  // Reset pagination on search
  React.useEffect(() => {
    if (!isManual) {
      setInternalPage(1);
    }
  }, [searchTerm, isManual]);

  // Handle local searching
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchable || searchKeys.length === 0) return data;
    
    const lowerSearch = searchTerm.toLowerCase().trim();
    return data.filter((row) => {
      return searchKeys.some((key) => {
        let value: any = "";
        if (typeof key === "function") {
          value = key(row);
        } else {
          value = row[key];
        }
        
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      });
    });
  }, [data, searchTerm, searchable, searchKeys]);

  // Handle local sorting (optional addition if clicked on header)
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    
    const sorted = [...filteredData].sort((a, b) => {
      const col = columns.find(c => c.key === sortConfig.key);
      if (!col) return 0;
      
      let aVal: any = a[sortConfig.key as keyof T];
      let bVal: any = b[sortConfig.key as keyof T];
      
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig, columns]);

  // Handle pagination
  const paginatedData = React.useMemo(() => {
    if (isManual) return sortedData;
    if (!pageSize) return sortedData;
    const startIndex = (activePage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, activePage, pageSize, isManual]);

  const totalPages = isManual
    ? (propTotalPages ?? (pageSize && totalItems !== undefined ? Math.max(Math.ceil(totalItems / pageSize), 1) : 1))
    : (pageSize ? Math.ceil(sortedData.length / pageSize) : 1);

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null; // unsorted
      }
      return { key, direction: "asc" };
    });
  };

  // Determine standard texts
  const resolvedErrorText = errorText || t("common.error");
  const resolvedNoDataText = noDataText || t("common.noData");
  const resolvedSearchPlaceholder = searchPlaceholder || t("common.search");

  return (
    <div 
      className={cn(
        "w-full bg-card rounded-3xl p-6 md:p-8 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Table Header Section */}
      {(title || subtitle || searchable || extraControls) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-5 border-b border-border/40">
          {/* Title & Subtitle */}
          {React.isValidElement(title) || typeof title === "string" ? (
            <div className="space-y-1">
              <h5 className="font-bold text-xl md:text-2xl text-foreground tracking-tight select-none">
                {title}
              </h5>
              {subtitle && (
                <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            (title || subtitle) && (
              <div className="space-y-1">
                {title}
                {subtitle}
              </div>
            )
          )}

          {/* Search bar & Extras */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {searchable && (
              <div className="relative flex-1 md:w-80 min-w-[200px]">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground/70">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={resolvedSearchPlaceholder}
                  className="w-full text-base font-medium ps-10 pe-10 py-2.5 bg-muted/40 hover:bg-muted/70 focus:bg-card border border-border/60 focus:border-primary/80 rounded-xl outline-none transition-all placeholder:text-muted-foreground/60 focus:ring-4 focus:ring-primary/10 text-foreground"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted-foreground/70 hover:text-foreground transition-colors outline-none cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            {extraControls}
          </div>
        </div>
      )}

      {/* Main Table Responsive Container */}
      <div className={cn("relative overflow-x-auto rounded-2xl border border-border/40 bg-card/50 backdrop-blur-[2px] transition-opacity duration-200", isFetching && "opacity-75")}>
        {isFetching && (
          <div className="absolute top-0 inset-x-0 h-1 bg-primary/20 overflow-hidden z-20">
            <div className="h-full bg-primary animate-pulse w-full" />
          </div>
        )}
        <table 
          className={cn("w-full border-collapse text-start align-middle", tableClassName)}
          style={{ minWidth: "600px" }}
        >
          {/* Thead */}
          <thead className={cn("bg-muted/40 border-b border-border/40", headerClassName)}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={cn(
                    "px-6 py-4.5 text-base md:text-[17px] font-bold text-foreground/80 text-start select-none transition-colors",
                    col.sortable && "cursor-pointer hover:bg-muted/70 hover:text-foreground",
                    col.thClassName
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortConfig?.key === col.key && (
                      <span className="text-primary font-black text-sm">
                        {sortConfig.direction === "asc" ? " ▴" : " ▾"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Tbody */}
          <tbody className="divide-y divide-border/30">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: pageSize || 5 }).map((_, rIdx) => (
                <tr 
                  key={`skeleton-row-${rIdx}`} 
                  className="animate-pulse border-b border-border/20 last:border-0"
                >
                  {columns.map((col, cIdx) => (
                    <td key={`skeleton-cell-${rIdx}-${cIdx}`} className="px-6 py-5.5">
                      <Skeleton 
                        className={cn(
                          "h-5.5 rounded-md", 
                          cIdx === 0 ? "w-2/3" : cIdx === 1 ? "w-4/5" : "w-1/2"
                        )} 
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              // Error state
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-12 text-center text-destructive bg-destructive/5"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <AlertCircle className="w-10 h-10 animate-bounce" />
                    <span className="text-lg font-bold">{resolvedErrorText}</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              // Empty state
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-16 text-center text-muted-foreground/80 font-medium"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-muted/30 rounded-full text-muted-foreground/50">
                      <HelpCircle className="w-10 h-10" />
                    </div>
                    <span className="text-lg">{resolvedNoDataText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              // Normal rows
              paginatedData.map((row, rIdx) => {
                const rowId = getRowId ? getRowId(row) : rIdx;
                const isExpanded = expandedRows ? expandedRows[rowId] : false;

                return (
                  <React.Fragment key={`row-wrapper-${rowId}`}>
                    <tr
                      key={`row-${rowId}`}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        "hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 border-b border-border/20 last:border-0",
                        onRowClick && "cursor-pointer",
                        rowClassName
                      )}
                    >
                      {columns.map((col) => {
                        const cellContent = col.render ? col.render(row, rIdx) : (row[col.key as keyof T] as React.ReactNode);
                        return (
                          <td
                            key={`cell-${col.key}`}
                            className={cn(
                              "px-6 py-5 text-base md:text-[17px] text-foreground/80 leading-relaxed font-semibold transition-colors duration-150",
                              col.className
                            )}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                    {isExpanded && renderExpandedRow && (
                      <tr key={`expanded-${rowId}`}>
                        <td colSpan={columns.length} className="p-0 border-b border-border/20 bg-muted/10">
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pageSize && totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 pt-5 border-t border-border/40 select-none">
          {/* Summary text */}
          <span className="text-base text-muted-foreground/80 font-medium text-center sm:text-start">
            {t("common.showingRows", {
              start: sortedData.length === 0 ? 0 : (activePage - 1) * pageSize + 1,
              end: isManual
                ? (totalItems !== undefined
                    ? Math.min((activePage - 1) * pageSize + sortedData.length, totalItems)
                    : (activePage - 1) * pageSize + sortedData.length)
                : Math.min(activePage * pageSize, sortedData.length),
              total: isManual
                ? (totalItems ?? (totalPages * pageSize))
                : sortedData.length,
            })}
          </span>

          {/* Page buttons */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(activePage - 1, 1))}
              disabled={activePage === 1 || isFetching}
              aria-label={t("common.previous")}
              className="p-2 border border-border/60 hover:bg-muted/50 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground rounded-xl transition-all outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5.5 h-5.5 rtl:rotate-180" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const p = pageIdx + 1;
              // Show limited pages to keep clean
              if (
                p === 1 || 
                p === totalPages || 
                (p >= activePage - 1 && p <= activePage + 1)
              ) {
                return (
                  <button
                    key={`page-btn-${p}`}
                    onClick={() => handlePageChange(p)}
                    disabled={isFetching}
                    className={cn(
                      "w-10 h-10 text-base font-bold rounded-xl transition-all border outline-none cursor-pointer disabled:cursor-not-allowed",
                      activePage === p 
                        ? "bg-primary text-primary-foreground border-primary shadow-sm hover:opacity-90" 
                        : "border-border/60 hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                );
              }
              
              if (p === activePage - 2 || p === activePage + 2) {
                return (
                  <span key={`ellipsis-${p}`} className="px-1 text-muted-foreground font-black">
                    ...
                  </span>
                );
              }
              
              return null;
            })}

            <button
              onClick={() => handlePageChange(Math.min(activePage + 1, totalPages))}
              disabled={activePage === totalPages || isFetching}
              aria-label={t("common.next")}
              className="p-2 border border-border/60 hover:bg-muted/50 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground rounded-xl transition-all outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5.5 h-5.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
