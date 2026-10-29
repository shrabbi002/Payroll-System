"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  TrendingUp,
  ListTree,
  Settings2,
  Users,
  FileSpreadsheet,
  Play,
  Gift,
  Sparkles,
  FileText,
  Printer,
  BookOpen,
  CheckSquare,
  Layout,
  Send,
  Archive,
  BarChart3,
  Shield,
  ScrollText,
  Wrench,
  Clock,
  CalendarOff,
  Timer,
  ChevronDown,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { NAV_SECTIONS } from "@/config/navigation";
import type { NavItem, NavSection } from "@/types";

/* ========================================================================
   Icon Map — Maps string icon names to Lucide components
   ======================================================================== */
const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  TrendingUp,
  ListTree,
  Settings2,
  Users,
  FileSpreadsheet,
  Play,
  Gift,
  Sparkles,
  FileText,
  Printer,
  BookOpen,
  CheckSquare,
  Layout,
  Send,
  Archive,
  BarChart3,
  Shield,
  ScrollText,
  Wrench,
  Clock,
  CalendarOff,
  Timer,
};

/* ========================================================================
   Sidebar Component
   ======================================================================== */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { hasAnyPermission } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => {
      // Auto-expand the section that contains the current route
      const activeSection = NAV_SECTIONS.find((section) =>
        section.items.some((item) => pathname.startsWith(item.href))
      );
      return new Set(activeSection ? [activeSection.id] : ["payroll"]);
    }
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const isItemVisible = (item: NavItem): boolean => {
    if (item.phase2) return true; // Always show phase2 items (but disabled)
    if (item.permissions.length === 0) return true;
    return hasAnyPermission(item.permissions);
  };

  const isSectionVisible = (section: NavSection): boolean => {
    return section.items.some(isItemVisible);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out no-print",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      {/* ---- Logo / Brand ---- */}
      <div
        className="flex items-center h-16 px-4 border-b shrink-0"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            P
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1
                className="text-sm font-semibold truncate"
                style={{ color: "var(--sidebar-text-active)" }}
              >
                PayrollPro
              </h1>
              <p
                className="text-[10px] truncate"
                style={{ color: "var(--sidebar-section-label)" }}
              >
                Management System
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_SECTIONS.filter(isSectionVisible).map((section) => (
          <div key={section.id} className="mb-1">
            {/* Section Header */}
            {!collapsed ? (
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors hover:bg-white/5"
                style={{ color: "var(--sidebar-section-label)" }}
              >
                <span>{section.label}</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    expandedSections.has(section.id)
                      ? "rotate-0"
                      : "-rotate-90"
                  )}
                />
              </button>
            ) : (
              <div
                className="h-px mx-3 my-2"
                style={{ backgroundColor: "var(--sidebar-border)" }}
              />
            )}

            {/* Section Items */}
            {(collapsed || expandedSections.has(section.id)) && (
              <ul className="space-y-0.5">
                {section.items.filter(isItemVisible).map((item) => {
                  const Icon = ICON_MAP[item.icon];
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "#" && pathname.startsWith(item.href + "/"));

                  return (
                    <li key={item.id}>
                      {item.phase2 ? (
                        <Phase2Item
                          item={item}
                          Icon={Icon}
                          collapsed={collapsed}
                        />
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 group",
                            collapsed && "justify-center px-0",
                            isActive
                              ? "font-medium shadow-xs"
                              : "hover:bg-white/5"
                          )}
                          style={{
                            backgroundColor: isActive
                              ? "rgba(255, 255, 255, 0.08)"
                              : undefined,
                            color: isActive
                              ? "#FFFFFF"
                              : "var(--sidebar-text)",
                          }}
                          title={collapsed ? item.label : undefined}
                        >
                          {Icon && (
                            <Icon
                              className="w-[18px] h-[18px] shrink-0 transition-colors"
                              style={{
                                color: isActive
                                  ? "var(--sidebar-icon-active)"
                                  : "var(--sidebar-icon)",
                              }}
                            />
                          )}
                          {!collapsed && (
                            <span className="truncate animate-fade-in">
                              {item.label}
                            </span>
                          )}
                          {isActive && !collapsed && (
                            <div
                              className="absolute left-0 w-[3px] h-6 rounded-r-full"
                              style={{ backgroundColor: "var(--primary)" }}
                            />
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* ---- Collapse Toggle ---- */}
      <div
        className="shrink-0 border-t p-3"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
          style={{ color: "var(--sidebar-text)" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="w-[18px] h-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="w-[18px] h-[18px]" />
              <span className="animate-fade-in">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

/* ---- Phase 2 Disabled Item ---- */
function Phase2Item({
  item,
  Icon,
  collapsed,
}: {
  item: NavItem;
  Icon: LucideIcon | undefined;
  collapsed: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-40",
        collapsed && "justify-center px-0"
      )}
      style={{ color: "var(--sidebar-text)" }}
      title={collapsed ? `${item.label} (Phase 2)` : undefined}
    >
      {Icon && (
        <Icon
          className="w-[18px] h-[18px] shrink-0"
          style={{ color: "var(--sidebar-icon)" }}
        />
      )}
      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>
          <span
            className="ml-auto text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full shrink-0"
            style={{
              backgroundColor: "var(--badge-draft-bg)",
              color: "var(--badge-draft)",
            }}
          >
            Phase 2
          </span>
        </>
      )}
    </div>
  );
}
