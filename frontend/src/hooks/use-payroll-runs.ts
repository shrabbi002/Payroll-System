import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollRunApi } from "@/services/payroll-run-service";

export const PAYROLL_RUN_KEYS = {
  all: ["payroll-runs"] as const,
  lists: () => [...PAYROLL_RUN_KEYS.all, "list"] as const,
  detail: (id: string) => [...PAYROLL_RUN_KEYS.all, "detail", id] as const,
};

export function usePayrollRuns() {
  return useQuery({ queryKey: PAYROLL_RUN_KEYS.lists(), queryFn: () => payrollRunApi.getRuns() });
}

export function usePayrollRun(id: string) {
  return useQuery({ queryKey: PAYROLL_RUN_KEYS.detail(id), queryFn: () => payrollRunApi.getRunById(id), enabled: Boolean(id) });
}

export function useSubmitForReview() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (runId: string) => payrollRunApi.submitForReview(runId), onSuccess: () => qc.invalidateQueries({ queryKey: PAYROLL_RUN_KEYS.all }) });
}

export function useApprovePayrollRun() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (runId: string) => payrollRunApi.approveRun(runId), onSuccess: () => qc.invalidateQueries({ queryKey: PAYROLL_RUN_KEYS.all }) });
}

export function useFinalizePayrollRun() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (runId: string) => payrollRunApi.finalizeRun(runId), onSuccess: () => qc.invalidateQueries({ queryKey: PAYROLL_RUN_KEYS.all }) });
}

export function useRejectPayrollRun() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ runId, reason }: { runId: string; reason: string }) => payrollRunApi.rejectRun(runId, reason), onSuccess: () => qc.invalidateQueries({ queryKey: PAYROLL_RUN_KEYS.all }) });
}
