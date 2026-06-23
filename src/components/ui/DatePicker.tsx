"use client";

import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
  value?: string; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  minDate?: string; // Format: YYYY-MM-DD
  maxDate?: string; // Format: YYYY-MM-DD
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
}

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAYS_AR = ["أح", "اث", "ثلا", "أر", "خم", "جم", "سب"];

export function DatePicker({
  value = "",
  onChange,
  minDate = "",
  maxDate = "",
  placeholder = "",
  disabled = false,
  className = "",
  hasError = false,
}: DatePickerProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    const today = new Date();
    if (minDate && new Date(minDate) > today) {
      return new Date(minDate);
    }
    return today;
  });

  const [selectedDateStr, setSelectedDateStr] = useState(value);

  const containerRef = useRef<HTMLDivElement>(null);

  const [prevValue, setPrevValue] = useState(value);

  // Sync state with value prop during render (prevents cascading useEffect renders)
  if (value !== prevValue) {
    setPrevValue(value);
    setSelectedDateStr(value);
    if (value) {
      setCurrentDate(new Date(value));
    }
  }

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    if (minDate) {
      const min = new Date(minDate);
      const minYear = min.getFullYear();
      const minMonth = min.getMonth();
      if (year < minYear || (year === minYear && month <= minMonth)) {
        return;
      }
    }
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    if (maxDate) {
      const max = new Date(maxDate);
      const maxYear = max.getFullYear();
      const maxMonth = max.getMonth();
      if (year > maxYear || (year === maxYear && month >= maxMonth)) {
        return;
      }
    }
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), month, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(year, parseInt(e.target.value), 1));
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(year, month, day);
    // Format to local date string YYYY-MM-DD safely
    const formatted = formatDateString(selected);
    setSelectedDateStr(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  // Helper to format date as YYYY-MM-DD
  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const d = date.getDate();
    const m = isRtl ? MONTHS_AR[date.getMonth()] : MONTHS_EN[date.getMonth()];
    const y = date.getFullYear();

    return isRtl ? `${d} ${m} ${y}` : `${m} ${d}, ${y}`;
  };

  // Generate days grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday is 0

  const daysArray: (number | null)[] = [];
  // Fill initial blanks
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // Determine if a date is within min/max bounds
  const isDateDisabled = (day: number): boolean => {
    const dateToCheck = new Date(year, month, day);
    dateToCheck.setHours(0, 0, 0, 0);

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (dateToCheck < min) return true;
    }

    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (dateToCheck > max) return true;
    }

    return false;
  };

  // Render year select options (current year and next year only)
  const currentYear = new Date().getFullYear();
  const yearsOptions = [currentYear, currentYear + 1];
  if (!yearsOptions.includes(year) && year >= currentYear) {
    yearsOptions.push(year);
    yearsOptions.sort((a, b) => a - b);
  }

  const months = isRtl ? MONTHS_AR : MONTHS_EN;
  const weekdays = isRtl ? WEEKDAYS_AR : WEEKDAYS_EN;

  const isPrevMonthDisabled = (() => {
    if (!minDate) return false;
    const min = new Date(minDate);
    const minYear = min.getFullYear();
    const minMonth = min.getMonth();
    return year < minYear || (year === minYear && month <= minMonth);
  })();

  const isNextMonthDisabled = (() => {
    if (!maxDate) return false;
    const max = new Date(maxDate);
    const maxYear = max.getFullYear();
    const maxMonth = max.getMonth();
    return year > maxYear || (year === maxYear && month >= maxMonth);
  })();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Input */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-muted/50 border text-foreground text-sm rounded-xl p-3.5 transition-colors cursor-pointer text-left rtl:text-right select-none",
          hasError ? "border-destructive focus:ring-4 focus:ring-destructive/20 focus:border-destructive" : "border-border/50 focus:ring-4 focus:ring-primary/20 focus:border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className={cn(!selectedDateStr && "text-muted-foreground")}>
          {selectedDateStr ? formatDisplayDate(selectedDateStr) : placeholder || (isRtl ? "اختر التاريخ" : "Select date")}
        </span>
        <CalendarIcon className="w-5 h-5 text-muted-foreground shrink-0 ms-2" />
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-76 bg-popover text-popover-foreground rounded-2xl border border-border/70 p-4 shadow-xl backdrop-blur-md transition-all duration-100 animate-in fade-in-0 zoom-in-95 origin-top",
            "start-0"
          )}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <button
              type="button"
              disabled={isPrevMonthDisabled}
              onClick={handlePrevMonth}
              className={cn(
                "p-1.5 rounded-lg transition-colors shrink-0",
                isPrevMonthDisabled
                  ? "opacity-35 cursor-not-allowed text-muted-foreground/40"
                  : "hover:bg-muted cursor-pointer text-foreground"
              )}
              aria-label="Previous month"
            >
              {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-1.5 overflow-hidden">
              {/* Month Select */}
              <select
                value={month}
                onChange={handleMonthChange}
                className="bg-transparent border-0 font-semibold text-sm focus:outline-none cursor-pointer hover:bg-muted py-1 px-1.5 rounded-md text-foreground"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx} className="bg-popover text-foreground text-xs font-normal">
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Select */}
              <select
                value={year}
                onChange={handleYearChange}
                className="bg-transparent border-0 font-semibold text-sm focus:outline-none cursor-pointer hover:bg-muted py-1 px-1.5 rounded-md text-foreground"
              >
                {yearsOptions.map((y) => (
                  <option key={y} value={y} className="bg-popover text-foreground text-xs font-normal">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={isNextMonthDisabled}
              onClick={handleNextMonth}
              className={cn(
                "p-1.5 rounded-lg transition-colors shrink-0",
                isNextMonthDisabled
                  ? "opacity-35 cursor-not-allowed text-muted-foreground/40"
                  : "hover:bg-muted cursor-pointer text-foreground"
              )}
              aria-label="Next month"
            >
              {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-2">
            {weekdays.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="py-1.5" />;
              }

              const disabledDay = isDateDisabled(day);
              const dateStr = formatDateString(new Date(year, month, day));
              const isSelected = selectedDateStr === dateStr;
              const isToday = formatDateString(new Date()) === dateStr;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus:outline-none flex items-center justify-center relative",
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 scale-105"
                      : disabledDay
                        ? "text-muted-foreground/30 cursor-not-allowed hover:bg-transparent"
                        : "text-foreground hover:bg-muted/70 active:scale-95",
                    isToday && !isSelected && "ring-1 ring-primary/40 border border-primary/20"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
