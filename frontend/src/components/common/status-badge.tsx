import { cn } from "@/lib/utils";
import type { RunStatus } from "@/types";

/* ========================================================================
   StatusBadge — Workflow status indicator pill
   Maps to payroll run / bonus run / certificate lifecycle statuses
   ======================================================================== */

const STATUS_STYLES: Record<
  string,
  { bgVar: string; textVar: string }
> = {
  Draft: { bgVar: "--badge-draft-bg", textVar: "--badge-draft" },
  Reviewed: { bgVar: "--badge-reviewed-bg", textVar: "--badge-reviewed" },
  Approved: { bgVar: "--badge-approved-bg", textVar: "--badge-approved" },
  Finalized: { bgVar: "--badge-finalized-bg", textVar: "--badge-finalized" },
  Rejected: { bgVar: "--badge-rejected-bg", textVar: "--badge-rejected" },
  Active: { bgVar: "--badge-approved-bg", textVar: "--badge-approved" },
  Inactive: { bgVar: "--badge-rejected-bg", textVar: "--badge-rejected" },
  active: { bgVar: "--badge-approved-bg", textVar: "--badge-approved" },
  inactive: { bgVar: "--badge-rejected-bg", textVar: "--badge-rejected" },
};

interface StatusBadgeProps {
  status: RunStatus | "Active" | "Inactive" | "active" | "inactive" | string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  label,
  className,
  size = "sm",
}: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || {
    bgVar: "--badge-draft-bg",
    textVar: "--badge-draft",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border px-2.5 py-0.5 text-xs",
        size === "sm" ? "text-[11px] py-0.5" : "text-xs py-1",
        className
      )}
      style={{
        backgroundColor: `var(${style.bgVar})`,
        color: `var(${style.textVar})`,
        borderColor: `color-mix(in srgb, var(${style.textVar}) 25%, transparent)`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: `var(${style.textVar})` }}
      />
      {label ?? status}
    </span>
  );
}
