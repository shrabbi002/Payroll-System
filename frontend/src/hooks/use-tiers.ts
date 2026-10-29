import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tierApi } from "@/services/tier-service";
import type { EmployeeTierFormData } from "@/types";

export const TIER_KEYS = {
  all: ["tiers"] as const,
  lists: () => [...TIER_KEYS.all, "list"] as const,
  detail: (id: string) => [...TIER_KEYS.all, "detail", id] as const,
};

export function useTiers() {
  return useQuery({
    queryKey: TIER_KEYS.lists(),
    queryFn: () => tierApi.getTiers(),
  });
}

export function useTier(id: string) {
  return useQuery({
    queryKey: TIER_KEYS.detail(id),
    queryFn: () => tierApi.getTierById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeTierFormData) => tierApi.createTier(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIER_KEYS.all }),
  });
}

export function useUpdateTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeTierFormData> }) =>
      tierApi.updateTier(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIER_KEYS.all }),
  });
}

export function useToggleTierStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tierApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIER_KEYS.all }),
  });
}
