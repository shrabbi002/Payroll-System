"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getInitials } from "@/lib/utils";

/* ========================================================================
   Header Component — Top Navigation Bar
   ======================================================================== */

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light"
    );
  };

  const roleBadgeLabel = user?.role.replace(/_/g, " ") ?? "";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 border-b transition-all duration-300 no-print",
        sidebarCollapsed ? "left-[68px]" : "left-[260px]"
      )}
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--header-border)",
      }}
    >
      {/* ---- Left: Search ---- */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-200 w-full",
            searchFocused ? "ring-2" : ""
          )}
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: searchFocused
              ? "var(--input-focus-border)"
              : "var(--input-border)",
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(33, 150, 243, 0.1)"
              : undefined,
          }}
        >
          <Search
            className="w-4 h-4 shrink-0"
            style={{ color: "var(--foreground-muted)" }}
          />
          <input
            type="text"
            placeholder="Search employees, runs, reports..."
            className="bg-transparent outline-none w-full text-sm"
            style={{
              color: "var(--foreground)",
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded border"
            style={{
              color: "var(--foreground-muted)",
              borderColor: "var(--border)",
              backgroundColor: "var(--background-muted)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ---- Right: Actions ---- */}
      <div className="flex items-center gap-2">
        {/* Organization Badge */}
        {user && (
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-orange-50/80 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800"
          >
            <Building2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span className="truncate max-w-[160px]">
              {user.organizationName}
            </span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors hover:bg-black/5"
          style={{ color: "var(--foreground-muted)" }}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg transition-colors hover:bg-black/5 relative"
            style={{ color: "var(--foreground-muted)" }}
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {/* Notification badge dot */}
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--destructive)" }}
            />
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-xl border p-4 animate-slide-down"
              style={{
                backgroundColor: "var(--background-card)",
                borderColor: "var(--border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--foreground)" }}
              >
                Notifications
              </h3>
              <div
                className="text-sm py-6 text-center"
                style={{ color: "var(--foreground-muted)" }}
              >
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="w-px h-8 mx-1"
          style={{ backgroundColor: "var(--border)" }}
        />

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors hover:bg-black/5"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "var(--primary-foreground)",
              }}
            >
              {user ? getInitials(user.fullName) : "?"}
            </div>
            {/* Name & Role */}
            <div className="hidden md:block text-left">
              <p
                className="text-sm font-medium leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                {user?.fullName ?? "Guest"}
              </p>
              <p
                className="text-[10px] uppercase tracking-wide leading-tight"
                style={{ color: "var(--foreground-muted)" }}
              >
                {roleBadgeLabel}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200 hidden md:block",
                profileOpen ? "rotate-180" : ""
              )}
              style={{ color: "var(--foreground-muted)" }}
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-xl border py-1 animate-slide-down"
              style={{
                backgroundColor: "var(--background-card)",
                borderColor: "var(--border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div
                className="px-3 py-2.5 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {user?.fullName}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {user?.email}
                </p>
              </div>

              <DropdownItem icon={User} label="My Profile" />
              <DropdownItem icon={Settings} label="Settings" />
              <div
                className="h-px my-1"
                style={{ backgroundColor: "var(--border)" }}
              />
              <DropdownItem
                icon={LogOut}
                label="Sign Out"
                danger
                onClick={logout}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---- Dropdown Menu Item ---- */
function DropdownItem({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: typeof User;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-black/5"
      style={{
        color: danger ? "var(--destructive)" : "var(--foreground-secondary)",
      }}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
