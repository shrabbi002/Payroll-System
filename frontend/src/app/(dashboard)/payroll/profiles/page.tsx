"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2,
  Layers,
  ToggleLeft,
  ToggleRight,
  Banknote,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/common";
import { cn } from "@/lib/utils";
import { EmployeeProfile } from "@/types";
import {
  useEmployeeProfiles,
  useToggleProfileStatus,
} from "@/hooks/use-employee-profiles";
import { useTiers } from "@/hooks/use-tiers";

export default function EmployeeProfilesPage() {
  const [mounted, setMounted] = useState(false);
  const { data: profiles = [], isLoading } = useEmployeeProfiles();
  const { data: tiers = [] } = useTiers();
  const toggleStatusMutation = useToggleProfileStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [globalFilter, setGlobalFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Complete" | "Pending" | "Inactive">("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "employeeId", desc: false },
  ]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => {
      if (p.department) set.add(p.department);
    });
    return Array.from(set).sort();
  }, [profiles]);

  const filteredData = useMemo(() => {
    return profiles.filter((p) => {
      if (statusFilter !== "all" && p.profileStatus !== statusFilter) return false;
      if (departmentFilter !== "all" && p.department !== departmentFilter) return false;
      if (tierFilter !== "all" && p.tierId !== tierFilter) return false;
      return true;
    });
  }, [profiles, statusFilter, departmentFilter, tierFilter]);

  const metrics = useMemo(() => {
    const total = profiles.length;
    const totalSalary = profiles.reduce((sum, p) => sum + p.totalSalary, 0);
    const totalBank = profiles.reduce((sum, p) => sum + p.bankSalary, 0);
    const totalCash = profiles.reduce((sum, p) => sum + p.cashSalary, 0);
    return { total, totalSalary, totalBank, totalCash };
  }, [profiles]);

  const columns = useMemo<ColumnDef<EmployeeProfile>[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-slate-700 dark:text-slate-300 hover:text-foreground"
          >
            Emp ID
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-coral-600 dark:text-coral-400 bg-coral-500/10 px-2 py-0.5 rounded border border-coral-500/20">
            {info.row.original.employeeId}
          </span>
        ),
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-slate-700 dark:text-slate-300 hover:text-foreground"
          >
            Name
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        ),
        cell: (info) => {
          const p = info.row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                {p.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{p.fullName}</p>
                <p className="text-xs text-muted-foreground">{p.department}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "designation",
        header: "Designation",
        cell: (info) => (
          <span className="text-xs text-foreground">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "tierName",
        header: "Tier",
        cell: (info) => {
          const p = info.row.original;
          return (
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-foreground border border-border">
                <Layers className="w-3 h-3 text-coral-500" />
                {p.tierName || "—"}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">{p.scaleLabel || "—"}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "totalSalary",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-slate-700 dark:text-slate-300 hover:text-foreground"
          >
            Total (৳)
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
            ৳{(info.getValue() as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "bankSalary",
        header: "Bank (৳)",
        cell: (info) => (
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 tabular-nums">
            ৳{(info.getValue() as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "cashSalary",
        header: "Cash (৳)",
        cell: (info) => {
          const val = info.getValue() as number;
          return (
            <span className={cn(
              "font-mono text-xs tabular-nums",
              val < 0 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-foreground"
            )}>
              ৳{val.toLocaleString()}
            </span>
          );
        },
      },
      {
        accessorKey: "variance",
        header: "Variance",
        cell: (info) => {
          const val = info.getValue() as number;
          const isHigh = Math.abs(val) > (info.row.original.totalSalary * 0.05);
          return (
            <div className="flex items-center gap-1">
              <span className={cn(
                "font-mono text-xs tabular-nums",
                val > 0 ? "text-emerald-600" : val < 0 ? "text-amber-600" : "text-muted-foreground"
              )}>
                {val > 0 ? "+" : ""}{val.toLocaleString()}
              </span>
              {isHigh && <AlertTriangle className="w-3 h-3 text-amber-500" />}
            </div>
          );
        },
      },
      {
        accessorKey: "profileStatus",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          const isComplete = status === "Complete";
          const isPending = status === "Pending";
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                isComplete
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : isPending
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isComplete ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-slate-400"
                )}
              />
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Active</div>,
        cell: ({ row }) => {
          const profile = row.original;
          return (
            <div className="flex items-center justify-end">
              <button
                onClick={() => toggleStatusMutation.mutate(profile.id)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  profile.isActive
                    ? "text-emerald-600 hover:bg-emerald-500/10"
                    : "text-slate-400 hover:bg-slate-500/10"
                )}
                title={profile.isActive ? "Deactivate" : "Activate"}
              >
                {profile.isActive ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [toggleStatusMutation]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (!mounted || isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Employee Profiles & Tuning"
          description="Bank/Cash salary split profiles for ATI Limited employees."
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border" />
          ))}
        </div>
        <div className="h-96 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Profiles & Tuning"
        description="Bank/Cash salary split profiles for ATI Limited employees."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<Users className="w-6 h-6" />} iconBg="bg-coral-500/10 text-coral-600 dark:text-coral-400" label="Total Profiles" value={String(metrics.total)} />
        <KpiCard icon={<Banknote className="w-6 h-6" />} iconBg="bg-blue-500/10 text-blue-600 dark:text-blue-400" label="Total Salary" value={`৳${metrics.totalSalary.toLocaleString()}`} />
        <KpiCard icon={<Building2 className="w-6 h-6" />} iconBg="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" label="Bank Salary" value={`৳${metrics.totalBank.toLocaleString()}`} />
        <KpiCard icon={<Wallet className="w-6 h-6" />} iconBg="bg-amber-500/10 text-amber-600 dark:text-amber-400" label="Cash Salary" value={`৳${metrics.totalCash.toLocaleString()}`} />
      </div>

      {/* Main Table Card */}
      <div
        className="rounded-xl border overflow-hidden shadow-sm"
        style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}
      >
        {/* Filters */}
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by name, ID, department..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none transition-colors"
              style={{ backgroundColor: "var(--background-muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-lg border outline-none"
              style={{ backgroundColor: "var(--background-muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-lg border outline-none"
              style={{ backgroundColor: "var(--background-muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">All Tiers</option>
              {tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            <div className="flex items-center p-1 rounded-lg border" style={{ backgroundColor: "var(--background-muted)", borderColor: "var(--border)" }}>
              {(["all", "Complete", "Pending", "Inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                    statusFilter === s
                      ? "bg-white dark:bg-slate-700 text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b" style={{ backgroundColor: "var(--background-muted)", borderColor: "var(--border)" }}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                    No employee profiles found matching the filters.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-500/5 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground" style={{ borderColor: "var(--border)" }}>
          <div>
            Showing <span className="font-semibold text-foreground">{table.getRowModel().rows.length}</span> of{" "}
            <span className="font-semibold text-foreground">{filteredData.length}</span> profiles
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-500/10 transition-colors" style={{ borderColor: "var(--border)" }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-500/10 transition-colors" style={{ borderColor: "var(--border)" }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, iconBg, label, value }: { icon: React.ReactNode; iconBg: string; label: string; value: string }) {
  return (
    <div className="p-5 rounded-xl border flex items-center gap-4 transition-all hover:shadow-sm" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5 tabular-nums">{value}</p>
      </div>
    </div>
  );
}
