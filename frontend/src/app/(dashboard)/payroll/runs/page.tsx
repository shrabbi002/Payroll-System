"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/common";
import type { PayrollRun } from "@/types";
import { usePayrollRuns } from "@/hooks/use-payroll-runs";

export default function PayrollRunsPage() {
  const [mounted, setMounted] = useState(false);
  const { data: runs = [], isLoading, error } = usePayrollRuns();

  useEffect(() => { setMounted(true); }, []);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "runNumber", desc: true }]);

  const columns = useMemo<ColumnDef<PayrollRun>[]>(() => [
    {
      accessorKey: "runNumber",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase hover:opacity-80">
          Run # <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (info) => <span className="font-mono text-xs font-bold">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "periodMonth",
      header: "Period",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <Calendar className="w-3.5 h-3.5" /> {row.original.periodMonth}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => <span className="text-sm font-medium">{info.getValue() as string}</span>,
    },
    { accessorKey: "totalEmployees", header: "Headcount", cell: (info) => <span className="text-xs">{info.getValue() as number}</span> },
    { id: "totalSalary", header: "Total Salary", cell: ({ row }) => <span className="text-xs font-semibold">৳{row.original.totalSalary.toLocaleString()}</span> },
    { id: "bankSalary", header: "Bank Salary", cell: ({ row }) => <span className="text-xs font-semibold text-blue-600">৳{row.original.totalBankSalary.toLocaleString()}</span> },
    { id: "cashSalary", header: "Cash Salary", cell: ({ row }) => <span className="text-xs font-semibold text-green-600">৳{row.original.totalCashSalary.toLocaleString()}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const map: Record<string, string> = { Draft: "draft", Reviewed: "info", Approved: "success", Finalized: "active", Rejected: "error" };
        return <StatusBadge status={map[s] || "draft"} label={s} />;
      },
    },
    { accessorKey: "version", header: "Ver", cell: (info) => <span className="text-xs">v{info.getValue() as number}</span> },
  ], []);

  const table = useReactTable({
    data: runs, columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Runs"
        description="Create and manage monthly payroll runs with bank/cash salary split. Draft → Reviewed → Approved → Finalized."
        breadcrumbs={[{ label: "Payroll", href: "/payroll/runs" }, { label: "Payroll Runs" }]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--primary)" }}>
            <Plus className="w-4 h-4" /> Create Run
          </button>
        }
      />

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        {!mounted || isLoading ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Loading payroll runs...</div>
        ) : runs.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            No payroll runs yet. Create your first run to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border)", backgroundColor: "var(--background-muted)" }}>
                    {hg.headers.map((h) => <th key={h.id} className="px-4 py-3">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>)}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b transition-colors hover:bg-black/2.5 dark:hover:bg-white/2.5" style={{ borderColor: "var(--border)" }}>
                    {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
