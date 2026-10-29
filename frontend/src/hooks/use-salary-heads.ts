import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryHeadApi } from "@/services/salary-head-service";
import type { SalaryHeadFormData } from "@/types";

export const HEAD_KEYS = {
  all: ["salary-heads"] as const,
  lists: () => [...HEAD_KEYS.all, "list"] as const,
  detail: (id: string) => [...HEAD_KEYS.all, "detail", id] as const,
};

export function useSalaryHeads() {
  return useQuery({ queryKey: HEAD_KEYS.lists(), queryFn: () => salaryHeadApi.getSalaryHeads() });
}

export function useSalaryHead(id: string) {
  return useQuery({ queryKey: HEAD_KEYS.detail(id), queryFn: () => salaryHeadApi.getSalaryHeadById(id), enabled: Boolean(id) });
}

export function useCreateSalaryHead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: SalaryHeadFormData) => salaryHeadApi.createSalaryHead(data), onSuccess: () => qc.invalidateQueries({ queryKey: HEAD_KEYS.all }) });
}

export function useUpdateSalaryHead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<SalaryHeadFormData> }) => salaryHeadApi.updateSalaryHead(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: HEAD_KEYS.all }) });
}

export function useToggleSalaryHeadStatus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => salaryHeadApi.toggleStatus(id), onSuccess: () => qc.invalidateQueries({ queryKey: HEAD_KEYS.all }) });
}
