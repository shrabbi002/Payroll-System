"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown, Search, Plus, Edit2, ChevronLeft, ChevronRight,
  Calendar, Eye,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/common";
import type { PayScale, PayScaleFormData } from "@/types";
import { useScales, useCreateScale, useUpdateScale, useToggleScaleStatus } from "@/hooks/use-scales";
import { ScaleModal } from "@/components/scales/scale-modal";

export default function ScalesPage() {
  const [mounted, setMounted] = useState(false);
  const { data: scales = [], isLoading, error } = useScales();
  const createMut = useCreateScale();
  const updateMut = useUpdateScale();
  const toggleMut = useToggleScaleStatus();

  useEffect(() => { setMounted(true); }, []);

  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "code", desc: false }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScale, setSelectedScale] = useState<PayScale | null>(null);
  const [expandedScale, setExpandedScale] = useState<PayScale | null>(null);

  const filteredData = useMemo(() => {
    return scales.filter((s) => {
      if (statusFilter === "active" && !s.isActive) return false;
      if (statusFilter === "inactive" && s.isActive) return false;
      return true;
    });
  }, [scales, statusFilter]);

  const columns = useMemo<ColumnDef<PayScale>[]>(() => [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase hover:opacity-80">
          Scale Code <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (info) => <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-black/5 dark:bg-white/5">{info.getValue() as string}</span>,
      size: 130,
    },
    {
      accessorKey: "label",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase hover:opacity-80">
          Scale Label <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{row.original.label}</div>
      ),
    },
    {
      id: "formula",
      header: "Progression (Start + Inc × Nmax = Ceiling)",
      cell: ({ row }) => (
        <div className="text-xs">
          <div className="font-medium" style={{ color: "var(--foreground)" }}>
            ৳{row.original.startAmount.toLocaleString()} + ৳{row.original.incrementAmount.toLocaleString()} × {row.original.maxIncrements ?? "∞"}
          </div>
          {row.original.ceilingAmount && (
            <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              Ceiling: <strong className="text-foreground">৳{row.original.ceilingAmount.toLocaleString()}</strong>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "preview",
      header: "Preview",
      cell: ({ row }) => (
        <button type="button" onClick={() => setExpandedScale(row.original)} className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md border hover:bg-black/5 dark:hover:bg-white/10 transition-colors" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>
          <Eye className="w-3 h-3" /> N=0..{row.original.maxIncrements ?? "?"}
        </button>
      ),
      size: 110,
    },
    {
      id: "approvalStatus",
      header: "Approval",
      cell: ({ row }) => (
        <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${row.original.approvalStatus === "Approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
          {row.original.approvalStatus}
        </span>
      ),
      size: 100,
    },
    {
      id: "effectiveDates",
      header: "Effective Period",
      cell: ({ row }) => (
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(row.original.effectiveFrom).toLocaleDateString("en-US", { month: "short", year: "numeric" })}{row.original.effectiveTo ? ` – ${new Date(row.original.effectiveTo).toLocaleDateString("en-US", { month: "short", year: "numeric" })}` : " – Present"}</span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <button onClick={() => toggleMut.mutate(row.original.id)} title="Toggle status" className="cursor-pointer transition-transform hover:scale-105">
          <StatusBadge status={row.original.isActive ? "active" : "inactive"} label={row.original.isActive ? "Active" : "Inactive"} />
        </button>
      ),
      size: 100,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <button onClick={() => { setSelectedScale(row.original); setIsModalOpen(true); }} title="Edit scale" className="p-1.5 rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/10" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          <Edit2 className="w-4 h-4" />
        </button>
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

  const handleModalSubmit = async (formData: PayScaleFormData) => {
    if (selectedScale) await updateMut.mutateAsync({ id: selectedScale.id, data: formData });
    else await createMut.mutateAsync(formData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pay Scale Setup"
        description="Define pay scales with starting amounts, increments, and maximum increment counts. Scales are independent — linked to tiers from the Tier screen."
        breadcrumbs={[{ label: "Setup", href: "/setup/scales" }, { label: "Pay Scale Setup" }]}
        actions={
          <button onClick={() => { setSelectedScale(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--primary)" }}>
            <Plus className="w-4 h-4" /> Create Pay Scale
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
          <input type="text" value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search code, label..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        </div>
        <div className="inline-flex rounded-lg border p-1" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
          {(["all", "active", "inactive"] as const).map((mode) => (
            <button key={mode} onClick={() => setStatusFilter(mode)} className="px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors" style={{ backgroundColor: statusFilter === mode ? "var(--primary)" : "transparent", color: statusFilter === mode ? "var(--primary-foreground)" : "var(--muted-foreground)" }}>
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
        {!mounted || isLoading ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Loading pay scales...</div>
        ) : error ? (
          <div className="p-12 text-center text-sm text-red-500">Error loading pay scales.</div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>No pay scales found.</div>
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
            <div>Showing {table.getRowModel().rows.length} of {filteredData.length} scales</div>
            <div className="flex items-center gap-2">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: "var(--border)" }}><ChevronLeft className="w-4 h-4" /></button>
              <span>Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: "var(--border)" }}><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {expandedScale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setExpandedScale(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl border shadow-2xl p-6 z-10 space-y-4" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <div>
                <h3 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>{expandedScale.label} — Increment Preview</h3>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{expandedScale.code}</p>
              </div>
              <button onClick={() => setExpandedScale(null)} className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/10" style={{ borderColor: "var(--border)" }}>✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {Array.from({ length: (expandedScale.maxIncrements ?? 0) + 1 }, (_, n) => (
                <div key={n} className="p-3 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">N = {n}</span>
                  <span className="text-sm font-bold mt-1" style={{ color: "var(--foreground)" }}>৳{(expandedScale.startAmount + expandedScale.incrementAmount * n).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground" style={{ borderColor: "var(--border)" }}>
              <span>Start: ৳{expandedScale.startAmount.toLocaleString()}</span>
              <span>Increment: +৳{expandedScale.incrementAmount.toLocaleString()}</span>
              {expandedScale.ceilingAmount && <span className="font-bold text-foreground">Ceiling: ৳{expandedScale.ceilingAmount.toLocaleString()}</span>}
            </div>
          </div>
        </div>
      )}

      <ScaleModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedScale(null); }} onSubmit={handleModalSubmit} scale={selectedScale} isLoading={createMut.isPending || updateMut.isPending} />
    </div>
  );
}
