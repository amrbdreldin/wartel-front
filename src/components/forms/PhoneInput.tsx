"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface PhoneInputProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

export function PhoneInput({
  name,
  value = "",
  onChange,
  onBlur,
  disabled,
  className,
  hasError,
  placeholder,
  icon,
}: PhoneInputProps) {
  const handleNumberChange = (newLocal: string) => {
    if (onChange) {
      onChange(newLocal);
    }
  };

  return (
    <div className={cn("relative flex text-left", className)} dir="ltr">
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={value} 
        />
      )}

      {/* Phone Number Input */}
      <div className="relative flex-grow">
        {icon && (
          <div className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground z-30 pointer-events-none group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <Input
          type="tel"
          placeholder={placeholder || "01012345678"}
          disabled={disabled}
          dir="ltr"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, ''); // only digits
            handleNumberChange(val);
          }}
          onBlur={onBlur}
          className={cn(
            "h-11 rounded-xl border-border/60 bg-background/50 transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
            icon ? "pl-10 pr-3" : "px-3",
            hasError && "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive text-destructive"
          )}
        />
      </div>
    </div>
  );
}
