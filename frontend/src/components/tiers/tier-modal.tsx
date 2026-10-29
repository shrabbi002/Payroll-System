"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { employeeTierSchema, type EmployeeTierFormData, type EmployeeTier } from "@/types";

interface TierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeTierFormData) => Promise<void>;
  tier?: EmployeeTier | null;
  isLoading?: boolean;
}

export function TierModal({
  isOpen,
  onClose,
  onSubmit,
  tier,
  isLoading = false,
}: TierModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeTierFormData>({
    resolver: zodResolver(employeeTierSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      erpDesignationCode: "",
      displayOrder: 1,
      isActive: true,
    },
  });

  useEffect(() => {
    if (tier) {
      reset({
        code: tier.code,
        name: tier.name,
        description: tier.description || "",
        erpDesignationCode: tier.erpDesignationCode || "",
        displayOrder: tier.displayOrder,
        isActive: tier.isActive,
      });
    } else {
      reset({
        code: "",
        name: "",
        description: "",
        erpDesignationCode: "",
        displayOrder: 1,
        isActive: true,
      });
    }
    setServerError(null);
  }, [tier, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: EmployeeTierFormData) => {
    try {
      setServerError(null);
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setServerError(err.message || "An error occurred while saving the tier.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden z-10" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{tier ? "Edit Employee Tier" : "Create New Employee Tier"}</h2>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Define hierarchy tier, linked scale, and ERP designation mapping.</p>
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
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Tier Code <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. T-MGR" {...register("code")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none uppercase" style={{ backgroundColor: "var(--background)", borderColor: errors.code ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.code && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.code.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Tier Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Manager" {...register("name")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.name ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.name && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Description</label>
              <textarea rows={2} placeholder="Brief description" {...register("description")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>ERP Designation Code</label>
                <input type="text" placeholder="e.g. DES-MGR (optional)" {...register("erpDesignationCode")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none font-mono" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Display Order <span className="text-red-500">*</span></label>
                <input type="number" {...register("displayOrder", { valueAsNumber: true })} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.displayOrder ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.displayOrder && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.displayOrder.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="isActive" {...register("isActive")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <label htmlFor="isActive" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Active (can be assigned to employees)</label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <button type="button" onClick={onClose} disabled={isSubmitting || isLoading} className="px-4 py-2 text-sm rounded-lg border font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
            <button type="submit" disabled={isSubmitting || isLoading} className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors text-white" style={{ backgroundColor: "var(--primary)" }}>
              {(isSubmitting || isLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {tier ? "Update Tier" : "Create Tier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
