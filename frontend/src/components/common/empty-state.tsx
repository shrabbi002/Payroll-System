import { type LucideIcon, Inbox } from "lucide-react";

/* ========================================================================
   EmptyState — Placeholder for sections with no data
   ======================================================================== */

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--background-muted)" }}
      >
        <Icon
          className="w-7 h-7"
          style={{ color: "var(--foreground-muted)" }}
        />
      </div>
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm max-w-sm mb-4"
          style={{ color: "var(--foreground-muted)" }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--primary-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--primary)")
          }
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
