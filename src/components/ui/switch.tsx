import * as React from "react";
import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  size?: "default" | "lg";
  "aria-label"?: string;
}

const switchSizeClass = {
  default: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
    on: "translate-x-4",
    off: "translate-x-0",
  },
  lg: {
    track: "h-8 w-[4.25rem]",
    thumb: "h-7 w-7",
    on: "translate-x-[2.25rem]",
    off: "translate-x-0.5",
  },
} as const;

export function Switch({
  checked,
  onCheckedChange,
  className,
  disabled,
  size = "default",
  "aria-label": ariaLabel,
}: SwitchProps) {
  const sizeClass = switchSizeClass[size];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "inline-flex items-center rounded-full border border-transparent p-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        sizeClass.track,
        checked
          ? "bg-[hsl(var(--primary)/0.95)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
          : "bg-[hsl(var(--muted)/0.95)] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none block rounded-full bg-[rgba(255,255,255,0.98)] shadow-[0_1px_2px_rgba(15,23,42,0.18)] ring-0 transition-transform duration-150",
          sizeClass.thumb,
          checked ? sizeClass.on : sizeClass.off,
        )}
      />
    </button>
  );
}
