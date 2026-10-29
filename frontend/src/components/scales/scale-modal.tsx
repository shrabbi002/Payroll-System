"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { payScaleSchema, type PayScaleFormData, type PayScale } from "@/types";

interface ScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PayScaleFormData) => Promise<void>;
  scale?: PayScale | null;
  isLoading?: boolean;
}

export function ScaleModal({
  isOpen,
  onClose,
  onSubmit,
  scale,
  isLoading = false,
}: ScaleModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PayScaleFormData>({
    resolver: zodResolver(payScaleSchema),
    defaultValues: {
      startAmount: 10000,
      incrementAmount: 900,
      maxIncrements: 20,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      isActive: true,
    },
  });

  const startAmount = watch("startAmount") || 0;
  const incrementAmount = watch("incrementAmount") || 0;
  const maxIncrements = watch("maxIncrements") || 0;

  const previewSteps = useMemo(() => {
    if (startAmount <= 0 || incrementAmount <= 0 || maxIncrements <= 0) return [];
    const steps: { n: number; basic: number }[] = [];
    const limit = Math.min(maxIncrements, 30);
    for (let n = 0; n <= limit; n++) {
      steps.push({ n, basic: startAmount + incrementAmount * n });
    }
    return steps;
  }, [startAmount, incrementAmount, maxIncrements]);

  useEffect(() => {
    if (!isOpen) return;
    if (scale) {
      reset({
        startAmount: scale.startAmount,
        incrementAmount: scale.incrementAmount,
        maxIncrements: scale.maxIncrements,
        effectiveFrom: scale.effectiveFrom?.slice(0, 10) || "2026-01-01",
        effectiveTo: scale.effectiveTo?.slice(0, 10) || null,
        isActive: scale.isActive,
      });
    } else {
      reset({
        startAmount: 10000,
        incrementAmount: 900,
        maxIncrements: 20,
        effectiveFrom: "2026-01-01",
        effectiveTo: null,
        isActive: true,
      });
    }
    setServerError(null);
  }, [scale, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: PayScaleFormData) => {
    try {
      setServerError(null);
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setServerError(err.message || "An error occurred while saving the pay scale.");
    }
  };

  const label = `${startAmount}-${incrementAmount}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden z-10" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{scale ? "Edit Pay Scale" : "Create New Pay Scale"}</h2>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Label auto-generated: <strong>{label}</strong></p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10" style={{ color: "var(--muted-foreground)" }}><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <AlertCircle className="w-4 h-4 shrink-0" /><span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Scale Start (৳) <span className="text-red-500">*</span></label>
                <input type="number" {...register("startAmount", { valueAsNumber: true })} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.startAmount ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.startAmount && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.startAmount.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Increment (৳) <span className="text-red-500">*</span></label>
                <input type="number" {...register("incrementAmount", { valueAsNumber: true })} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.incrementAmount ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.incrementAmount && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.incrementAmount.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Max Increments (Nmax)</label>
                <input type="number" {...register("maxIncrements", { valueAsNumber: true })} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.maxIncrements ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Effective From <span className="text-red-500">*</span></label>
                <input type="date" {...register("effectiveFrom")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.effectiveFrom ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.effectiveFrom && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.effectiveFrom.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Effective To</label>
                <input type="date" {...register("effectiveTo")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
            </div>

            {previewSteps.length > 0 && (
              <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "rgba(59, 130, 246, 0.04)", borderColor: "rgba(59, 130, 246, 0.2)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles className="w-4 h-4" /><span>Increment Preview (N=0 to {maxIncrements})</span></div>
                  <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Ceiling: <strong className="text-foreground">৳{previewSteps[previewSteps.length - 1]!.basic.toLocaleString()}</strong></div>
                </div>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {previewSteps.map((s) => (
                    <div key={s.n} className="px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
                      <span className="font-mono text-[10px] text-muted-foreground">N{s.n}:</span>
                      <span className="font-semibold" style={{ color: "var(--foreground)" }}>৳{s.basic.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="scaleActive" {...register("isActive")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <label htmlFor="scaleActive" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Active Scale</label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <button type="button" onClick={onClose} disabled={isSubmitting || isLoading} className="px-4 py-2 text-sm rounded-lg border font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
            <button type="submit" disabled={isSubmitting || isLoading} className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors text-white" style={{ backgroundColor: "var(--primary)" }}>
              {(isSubmitting || isLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {scale ? "Update Pay Scale" : "Create Pay Scale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
