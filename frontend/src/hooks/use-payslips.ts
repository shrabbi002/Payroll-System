import { useQuery } from "@tanstack/react-query";
import { payslipApi } from "@/services/payslip-service";

export const PAYSLIP_KEYS = {
  all: ["payslips"] as const,
  lists: (runId?: string) => [...PAYSLIP_KEYS.all, "list", runId || "all"] as const,
  detail: (id: string) => [...PAYSLIP_KEYS.all, "detail", id] as const,
};

export function usePayslips(runId?: string) {
  return useQuery({ queryKey: PAYSLIP_KEYS.lists(runId), queryFn: () => payslipApi.getPayslips(runId) });
}

export function usePayslip(id: string) {
  return useQuery({ queryKey: PAYSLIP_KEYS.detail(id), queryFn: () => payslipApi.getPayslipById(id), enabled: Boolean(id) });
}
