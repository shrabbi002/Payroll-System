"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, Plus, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/common";
import type { SalaryHead } from "@/types";
import { useSalaryHeads, useToggleSalaryHeadStatus } from "@/hooks/use-salary-heads";

export default function SalaryHeadsPage() {
  const [mounted, setMounted] = useState(false);
  const { data: heads = [], isLoading, error } = useSalaryHeads();
  const toggleMut = useToggleSalaryHeadStatus();

  useEffect(() => { setMounted(true); }, []);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "displayOrder", desc: false }]);

  const columns = useMemo<ColumnDef<SalaryHead>[]>(() => [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase hover:opacity-80">
          Code <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (info) => <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-black/5 dark:bg-white/5">{info.getValue() as string}</span>,
      size: 80,
    },
    {
      accessorKey: "name",
      header: "Head Name",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{row.original.name}</div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Label: {row.original.displayLabel}</div>
        </div>
      ),
    },
    {
      id: "calcType",
      header: "Calculation",
      cell: ({ row }) => (
        <div className="text-xs">
          <span className="font-medium">{row.original.calculationType === "PercentageOfBasic" ? `${row.original.currentValue}% of Basic` : `Fixed ৳${row.original.currentValue.toLocaleString()}`}</span>
        </div>
      ),
    },
    {
      id: "flags",
      header: "Flags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.partOfBankSalary && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Bank Salary</span>}
          {row.original.showOnPayslip && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Payslip</span>}
          {row.original.showOnCertificate && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Certificate</span>}
        </div>
      ),
    },
    {
      id: "rateVersions",
      header: "Rate Versions",
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.rateVersions.length} version(s)</span>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <button onClick={() => toggleMut.mutate(row.original.id)} className="cursor-pointer">
          <StatusBadge status={row.original.isActive ? "active" : "inactive"} label={row.original.isActive ? "Active" : "Inactive"} />
        </button>
      ),
      size: 100,
    },
  ], [toggleMut]);

  const table = useReactTable({
    data: heads, columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const totalHeads = heads.length;
  const pctHeads = heads.filter((h) => h.calculationType === "PercentageOfBasic").length;
  const fixedHeads = heads.filter((h) => h.calculationType === "Fixed").length;
  const bankHeads = heads.filter((h) => h.partOfBankSalary).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Heads"
        description="Configure salary head components that build the Bank Salary. Only heads flagged 'Part of Bank Salary' are included."
        breadcrumbs={[{ label: "Payroll", href: "/payroll/salary-heads" }, { label: "Salary Heads" }]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Heads", value: totalHeads },
          { label: "% of Basic", value: pctHeads },
          { label: "Fixed Amount", value: fixedHeads },
          { label: "Part of Bank Salary", value: bankHeads },
        ].map((c) => (
          <div key={c.label} className="p-4 rounded-xl border" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
            <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{c.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: "var(--foreground)" }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
          <input type="text" value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search heads..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        {!mounted || isLoading ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Loading salary heads...</div>
        ) : error ? (
          <div className="p-12 text-center text-sm text-red-500">Error loading salary heads.</div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>No salary heads found.</div>
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
