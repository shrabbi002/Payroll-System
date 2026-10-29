"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  Check,
  Sliders,
  Coins,
  Calendar,
  History,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/common";
import {
  payrollParametersSchema,
  type PayrollParametersFormData,
} from "@/types";
import {
  usePayrollParameters,
  useUpdatePayrollParameters,
} from "@/hooks/use-payroll-params";

export default function PayrollParametersPage() {
  const [mounted, setMounted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: params, isLoading } = usePayrollParameters();
  const updateMutation = useUpdatePayrollParameters();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PayrollParametersFormData>({
    resolver: zodResolver(payrollParametersSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (params) {
      reset({
        bankTargetPercent: params.bankTargetPercent,
        roundingMethod: params.roundingMethod,
        roundingUnit: params.roundingUnit,
        currencyCode: params.currencyCode,
        currencySymbol: params.currencySymbol,
        payrollPeriodType: params.payrollPeriodType,
        varianceTolerancePercent: params.varianceTolerancePercent,
        effectiveFrom: params.effectiveFrom,
        effectiveTo: params.effectiveTo,
      });
    }
  }, [params, reset]);

  const onSubmit = async (data: PayrollParametersFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update payroll parameters");
    }
  };

  const approvalStatus = params?.approvalStatus ?? "Draft";

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Payroll Parameters"
        description="Bank/Cash split configuration, rounding rules, currency, and variance tolerance for ATI Limited."
        breadcrumbs={[
          { label: "Payroll", href: "/payroll/salary-heads" },
          { label: "Payroll Parameters" },
        ]}
      />

      {!mounted || isLoading ? (
        <div
          className="p-12 text-center text-sm rounded-xl border"
          style={{
            backgroundColor: "var(--background-card)",
            borderColor: "var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          Loading payroll parameters...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Approval Status Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                approvalStatus === "Approved"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                approvalStatus === "Approved" ? "bg-emerald-500" : "bg-amber-500"
              }`} />
              {approvalStatus}
            </span>
            {params?.updatedAt && (
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Last updated: {new Date(params.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl text-sm border font-medium animate-fade-in bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Payroll parameters saved successfully!</span>
            </div>
          )}

          {/* Section 1: Bank Target */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <Sliders className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                Bank Salary Target
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Bank Target Percentage <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min={1}
                    max={100}
                    {...register("bankTargetPercent", { valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: errors.bankTargetPercent ? "var(--danger)" : "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <span className="absolute right-3 top-2.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    %
                  </span>
                </div>
                {errors.bankTargetPercent && (
                  <p className="text-xs mt-1 text-red-500">{errors.bankTargetPercent.message}</p>
                )}
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  80% Reference = Total Salary x this value. Used to suggest optimal increment count (N).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Variance Tolerance <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min={1}
                    max={50}
                    {...register("varianceTolerancePercent", { valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: errors.varianceTolerancePercent ? "var(--danger)" : "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <span className="absolute right-3 top-2.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    %
                  </span>
                </div>
                {errors.varianceTolerancePercent && (
                  <p className="text-xs mt-1 text-red-500">{errors.varianceTolerancePercent.message}</p>
                )}
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Flags a warning if |Bank Salary - 80% Ref| exceeds this % of Total Salary.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Rounding */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <Coins className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                Rounding & Currency
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Rounding Method
                </label>
                <select
                  {...register("roundingMethod")}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="HalfUp">Half-Up (Standard)</option>
                  <option value="RoundUp">Always Round Up</option>
                  <option value="RoundDown">Always Round Down</option>
                  <option value="NoRounding">No Rounding</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Rounding Unit
                </label>
                <select
                  {...register("roundingUnit")}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="1">Nearest ৳1</option>
                  <option value="0.5">Nearest ৳0.50</option>
                  <option value="0.01">Nearest ৳0.01 (Paisa)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Currency Code
                </label>
                <input
                  type="text"
                  {...register("currencyCode")}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Currency Symbol
                </label>
                <input
                  type="text"
                  {...register("currencySymbol")}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Period & Effective Dating */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                Period & Effective Dating
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Payroll Period Type
                </label>
                <select
                  {...register("payrollPeriodType")}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Effective From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("effectiveFrom")}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: errors.effectiveFrom ? "var(--danger)" : "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                {errors.effectiveFrom && (
                  <p className="text-xs mt-1 text-red-500">{errors.effectiveFrom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Effective To
                </label>
                <input
                  type="date"
                  {...register("effectiveTo")}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Leave blank if currently active.
                </p>
              </div>
            </div>
          </div>

          {/* Version History Placeholder */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <History className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                Version History
              </h3>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Parameter change history will appear here once connected to the backend.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Parameters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
