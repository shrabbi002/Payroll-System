"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import {
  employeeProfileSchema,
  type EmployeeProfileFormData,
  type EmployeeProfile,
} from "@/types";
import { useTiers } from "@/hooks/use-tiers";
import { useScales } from "@/hooks/use-scales";

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeProfileFormData) => Promise<void>;
  profile?: EmployeeProfile | null;
  isLoading?: boolean;
}

export function EmployeeProfileModal({
  isOpen,
  onClose,
  onSubmit,
  profile,
  isLoading = false,
}: EmployeeProfileModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { data: tiers = [] } = useTiers();
  const { data: scales = [] } = useScales();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeProfileFormData>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      employeeId: "",
      tierId: "",
      scaleOverride: false,
      scaleId: "",
      scaleOverrideReason: "",
      totalSalary: 0,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      incrementCount: 0,
      overrideReason: "",
    },
  });

  const scaleOverride = watch("scaleOverride");

  useEffect(() => {
    if (!isOpen) return;
    if (profile) {
      reset({
        employeeId: profile.employeeId,
        tierId: profile.tierId,
        scaleOverride: profile.scaleOverride,
        scaleId: profile.scaleId || "",
        scaleOverrideReason: profile.scaleOverrideReason || "",
        totalSalary: profile.totalSalary,
        effectiveFrom: profile.effectiveFrom?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        incrementCount: profile.incrementCount,
        overrideReason: profile.overrideReason || "",
      });
    } else {
      reset({
        employeeId: "",
        tierId: tiers[0]?.id || "",
        scaleOverride: false,
        scaleId: "",
        scaleOverrideReason: "",
        totalSalary: 0,
        effectiveFrom: new Date().toISOString().slice(0, 10),
        incrementCount: 0,
        overrideReason: "",
      });
    }
    setServerError(null);
  }, [profile, reset, isOpen, tiers]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: EmployeeProfileFormData) => {
    try {
      setServerError(null);
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setServerError(err.message || "An error occurred while saving the profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden z-10" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{profile ? "Edit Employee Profile" : "Enroll New Employee"}</h2>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Assign total salary and tier. The tuning algorithm calculates bank/cash split.</p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>ERP Employee ID <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Select from ERP" {...register("employeeId")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none font-mono" style={{ backgroundColor: "var(--background)", borderColor: errors.employeeId ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.employeeId && <p className="text-xs mt-1 text-red-500">{errors.employeeId.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Tier <span className="text-red-500">*</span></label>
                <select {...register("tierId")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.tierId ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }}>
                  <option value="">Select Tier...</option>
                  {tiers.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                </select>
                {errors.tierId && <p className="text-xs mt-1 text-red-500">{errors.tierId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Total Salary (৳) <span className="text-red-500">*</span></label>
                <input type="number" {...register("totalSalary", { valueAsNumber: true })} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none font-bold" style={{ backgroundColor: "var(--background)", borderColor: errors.totalSalary ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                {errors.totalSalary && <p className="text-xs mt-1 text-red-500">{errors.totalSalary.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Increment Count (N) <span className="text-red-500">*</span></label>
                <input type="number" {...register("incrementCount", { valueAsNumber: true })} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.incrementCount ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>The tuning algorithm will suggest the optimal N if left at 0.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Effective From <span className="text-red-500">*</span></label>
              <input type="date" {...register("effectiveFrom")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: errors.effectiveFrom ? "var(--danger)" : "var(--border)", color: "var(--foreground)" }} />
              {errors.effectiveFrom && <p className="text-xs mt-1 text-red-500">{errors.effectiveFrom.message}</p>}
            </div>

            <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="scaleOverride" {...register("scaleOverride")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <label htmlFor="scaleOverride" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>Override Scale Assignment</label>
              </div>
              {scaleOverride && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Override Scale</label>
                    <select {...register("scaleId")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                      <option value="">Select Scale...</option>
                      {scales.map((s) => <option key={s.id} value={s.id}>{s.label} ({s.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Override Reason</label>
                    <input type="text" {...register("scaleOverrideReason")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>Override Reason (if N is manually set)</label>
              <input type="text" placeholder="Optional justification" {...register("overrideReason")} className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <button type="button" onClick={onClose} disabled={isSubmitting || isLoading} className="px-4 py-2 text-sm rounded-lg border font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
            <button type="submit" disabled={isSubmitting || isLoading} className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors text-white" style={{ backgroundColor: "var(--primary)" }}>
              {(isSubmitting || isLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {profile ? "Update Profile" : "Save & Enroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
