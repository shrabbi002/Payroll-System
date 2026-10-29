"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface CreateRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    periodMonth: string;
    title: string;
    creatorName: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function CreateRunModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateRunModalProps) {
  const { user } = useAuth();
  const [periodMonth, setPeriodMonth] = useState("2026-10");
  const [title, setTitle] = useState("October 2026 Monthly Salary");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({
        periodMonth,
        title,
        creatorName: user?.fullName || "Payroll Administrator",
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to initiate payroll run.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <div>
              <h3 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>Create Payroll Run</h3>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Bank/Cash salary split calculation for all active profiles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--muted-foreground)" }}><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-xs flex items-center gap-2" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--foreground)" }}>Payroll Period Month</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input type="month" value={periodMonth} onChange={(e) => { setPeriodMonth(e.target.value); setTitle(`${e.target.value} Monthly Salary`); }} className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm font-medium" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--foreground)" }}>Run Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} required />
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: "var(--border)" }}>
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium rounded-lg border hover:bg-black/5 dark:hover:bg-white/10 transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
            <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-all" style={{ backgroundColor: "var(--primary)" }}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
