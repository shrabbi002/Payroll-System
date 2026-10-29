"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import {
  salaryHeadSchema,
  type SalaryHeadFormData,
  type SalaryHead,
} from "@/types";

interface SalaryHeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SalaryHeadFormData) => Promise<void>;
  head?: SalaryHead | null;
  isLoading?: boolean;
}

export function SalaryHeadModal({
  isOpen,
  onClose,
  onSubmit,
  head,
  isLoading = false,
}: SalaryHeadModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SalaryHeadFormData>({
    resolver: zodResolver(salaryHeadSchema),
    defaultValues: {
      code: "",
      name: "",
      displayLabel: "",
      calculationType: "PercentageOfBasic",
      partOfBankSalary: true,
      showOnPayslip: true,
      showOnCertificate: false,
      displayOrder: 1,
      isActive: true,
    },
  });

  const calculationType = watch("calculationType");

  useEffect(() => {
    if (head) {
      reset({
        code: head.code,
        name: head.name,
        displayLabel: head.displayLabel,
        calculationType: head.calculationType,
        partOfBankSalary: head.partOfBankSalary,
        showOnPayslip: head.showOnPayslip,
        showOnCertificate: head.showOnCertificate,
        displayOrder: head.displayOrder,
        isActive: head.isActive,
      });
    } else {
      reset({
        code: "",
        name: "",
        displayLabel: "",
        calculationType: "PercentageOfBasic",
        partOfBankSalary: true,
        showOnPayslip: true,
        showOnCertificate: false,
        displayOrder: 1,
        isActive: true,
      });
    }
    setServerError(null);
  }, [head, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: SalaryHeadFormData) => {
    try {
      setServerError(null);
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setServerError(err.message || "An error occurred while saving the salary head.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden z-10" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{head ? "Edit Salary Head" : "Create New Salary Head"}</h2>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Only Fixed or % of Basic. Rate versions are managed separately.</p>
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
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Head Code <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. HR" disabled={head?.isLocked} {...register("code")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none uppercase font-mono" style={{ backgroundColor: "var(--background)", borderColor: errors.code ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.code && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.code.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Head Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. House Rent" {...register("name")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.name ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.name && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Display Label <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. H/R" {...register("displayLabel")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.displayLabel ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.displayLabel && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.displayLabel.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Calculation Type <span className="text-red-500">*</span></label>
                <select {...register("calculationType")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option value="PercentageOfBasic">% of Basic Salary</option>
                  <option value="Fixed">Fixed Amount (৳)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Display Order <span className="text-red-500">*</span></label>
                <input type="number" {...register("displayOrder", { valueAsNumber: true })} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.displayOrder ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
              </div>
            </div>

            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {calculationType === "PercentageOfBasic"
                ? "The actual percentage value (e.g. 50%) is set via Rate Versions after creating the head."
                : "The fixed amount (e.g. ৳1,000) is set via Rate Versions after creating the head."}
            </div>

            <div className="pt-2 border-t space-y-2.5" style={{ borderColor: "var(--border)" }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>Flags</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer" style={{ color: "var(--foreground)" }}>
                  <input type="checkbox" {...register("partOfBankSalary")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span>Part of Bank Salary</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer" style={{ color: "var(--foreground)" }}>
                  <input type="checkbox" {...register("showOnPayslip")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span>Show on Payslip</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer" style={{ color: "var(--foreground)" }}>
                  <input type="checkbox" {...register("showOnCertificate")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span>Show on Salary Certificate</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer" style={{ color: "var(--foreground)" }}>
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span>Active Head</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <button type="button" onClick={onClose} disabled={isSubmitting || isLoading} className="px-4 py-2 text-sm rounded-lg border font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
            <button type="submit" disabled={isSubmitting || isLoading} className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors text-white" style={{ backgroundColor: "var(--primary)" }}>
              {(isSubmitting || isLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {head ? "Update Salary Head" : "Create Salary Head"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
