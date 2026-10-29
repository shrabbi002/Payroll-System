"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-provider";
import { Sidebar } from "@/components/shell/sidebar";
import { Header } from "@/components/shell/header";

/* ========================================================================
   Dashboard Layout — Protected shell wrapping all authenticated pages
   Provides: Sidebar + Header + Main content area
   ======================================================================== */

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthProvider>
      <QueryProvider>
        <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
          {/* Sidebar */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
          />

          {/* Header */}
          <Header sidebarCollapsed={sidebarCollapsed} />

          {/* Main Content Area */}
          <main
            className={cn(
              "pt-16 min-h-screen transition-all duration-300",
              sidebarCollapsed ? "pl-[68px]" : "pl-[260px]"
            )}
          >
            <div className="p-6 max-w-[1600px] mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </QueryProvider>
    </AuthProvider>
  );
}
