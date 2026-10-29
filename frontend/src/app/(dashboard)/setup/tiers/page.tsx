"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown, Search, Plus, Edit2, ChevronLeft, ChevronRight,
  Users, Layers, ToggleLeft, ToggleRight,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/common";
import { cn } from "@/lib/utils";
import type { EmployeeTier, EmployeeTierFormData } from "@/types";
import { useTiers, useCreateTier, useUpdateTier, useToggleTierStatus } from "@/hooks/use-tiers";
import { TierModal } from "@/components/tiers/tier-modal";

export default function TiersPage() {
  const [mounted, setMounted] = useState(false);
  const { data: tiers = [], isLoading, error } = useTiers();
  const createMut = useCreateTier();
  const updateMut = useUpdateTier();
  const toggleMut = useToggleTierStatus();

  useEffect(() => { setMounted(true); }, []);

  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "displayOrder", desc: false }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<EmployeeTier | null>(null);

  const filteredData = useMemo(() => {
    return tiers.filter((t) => {
      if (statusFilter === "active") return t.isActive;
      if (statusFilter === "inactive") return !t.isActive;
      return true;
    });
  }, [tiers, statusFilter]);

  const columns = useMemo<ColumnDef<EmployeeTier>[]>(() => [
    {
      accessorKey: "displayOrder",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-slate-700 dark:text-slate-300 hover:text-foreground">
          Order <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (info) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold" style={{ backgroundColor: "var(--background-muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
          {info.getValue() as number}
        </span>
      ),
      size: 70,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-slate-700 dark:text-slate-300 hover:text-foreground">
          Tier Code <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (info) => (
        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: "var(--background-muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
          {info.getValue() as string}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-slate-700 dark:text-slate-300 hover:text-foreground">
          Tier Name <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{row.original.name}</div>
          {row.original.description && <div className="text-xs truncate max-w-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{row.original.description}</div>}
        </div>
      ),
    },
    {
      id: "currentScale",
      header: "Current Scale",
      cell: ({ row }) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)", border: "1px solid rgba(59,130,246,0.3)" }}>
          {row.original.currentScaleLabel || "—"}
        </span>
      ),
    },
    {
      id: "erpDesignation",
      header: "ERP Designation",
      cell: ({ row }) => row.original.erpDesignationCode ? (
        <span className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: "var(--warning-light)", color: "var(--warning-foreground)", border: "1px solid rgba(245,158,11,0.3)" }}>
          {row.original.erpDesignationCode}
        </span>
      ) : <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      accessorKey: "employeeCount",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground">
          Employees <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{(info.getValue() as number).toLocaleString()}</span>
        </div>
      ),
      size: 110,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <button onClick={() => toggleMut.mutate(row.original.id)} title="Toggle status" className="cursor-pointer transition-opacity hover:opacity-80">
          <StatusBadge status={row.original.isActive ? "active" : "inactive"} label={row.original.isActive ? "Active" : "Inactive"} />
        </button>
      ),
      size: 100,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => { setSelectedTier(row.original); setIsModalOpen(true); }} title="Edit tier" className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
      size: 60,
    },
  ], [toggleMut]);

  const table = useReactTable({
    data: filteredData, columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleModalSubmit = async (formData: EmployeeTierFormData) => {
    if (selectedTier) await updateMut.mutateAsync({ id: selectedTier.id, data: formData });
    else await createMut.mutateAsync(formData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tier of Employee"
        description="Configure employee hierarchy tiers with scale linkages and ERP designation mapping."
        breadcrumbs={[{ label: "Setup", href: "/setup/tiers" }, { label: "Tier of Employee" }]}
        actions={
          <button onClick={() => { setSelectedTier(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--primary)" }}>
            <Plus className="w-4 h-4" /> Create Tier
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Tiers", value: tiers.length, bg: "var(--background-muted)", fg: "var(--foreground)" },
          { label: "Active", value: tiers.filter((t) => t.isActive).length, bg: "var(--success-light)", fg: "var(--success)" },
          { label: "Employees Mapped", value: tiers.reduce((a, t) => a + (t.employeeCount || 0), 0), bg: "var(--primary-light)", fg: "var(--primary)" },
          { label: "With Scale", value: tiers.filter((t) => t.currentScaleId).length, bg: "var(--warning-light)", fg: "var(--warning-foreground)" },
        ].map((card) => (
          <div key={card.label} className="p-4 rounded-xl border flex items-center gap-3.5" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: card.bg, color: card.fg }}>{card.value}</div>
            <div>
              <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{card.label}</div>
              <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
          <input type="text" value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by code, name, scale..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        </div>
        <div className="inline-flex rounded-lg border p-1 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          {(["all", "active", "inactive"] as const).map((mode) => (
            <button key={mode} onClick={() => setStatusFilter(mode)} className={cn("px-3.5 py-1 text-xs font-medium rounded-md capitalize transition-all", statusFilter === mode ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}>
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
        {!mounted || isLoading ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Loading employee tiers...</div>
        ) : error ? (
          <div className="p-12 text-center text-sm text-red-500">Error loading tiers.</div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>No tiers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border)", backgroundColor: "var(--background-muted)" }}>
                    {hg.headers.map((h) => <th key={h.id} className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>)}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-black/2.5 dark:hover:bg-white/2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-4 py-3 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mounted && !isLoading && table.getRowModel().rows.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
            <div>Showing <span className="font-semibold text-foreground">{table.getRowModel().rows.length}</span> of <span className="font-semibold text-foreground">{filteredData.length}</span> tiers</div>
            <div className="flex items-center gap-2">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: "var(--border)" }}><ChevronLeft className="w-4 h-4" /></button>
              <span>Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: "var(--border)" }}><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <TierModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedTier(null); }} onSubmit={handleModalSubmit} tier={selectedTier} isLoading={createMut.isPending || updateMut.isPending} />
    </div>
  );
}
