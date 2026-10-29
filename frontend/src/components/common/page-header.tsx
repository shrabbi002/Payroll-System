import { type ReactNode } from "react";

/* ========================================================================
   PageHeader — Consistent page heading with optional action buttons
   ======================================================================== */

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional breadcrumb items */
  breadcrumbs?: { label: string; href?: string }[];
  /** Action buttons on the right side */
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs mb-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <span style={{ color: "var(--foreground-muted)" }}>/</span>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="transition-colors hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  {crumb.label}
                </a>
              ) : (
                <span style={{ color: "var(--foreground-muted)" }}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--foreground-muted)" }}
            >
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
