import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scaleApi } from "@/services/scale-service";
import type { PayScaleFormData } from "@/types";

export const SCALE_KEYS = {
  all: ["scales"] as const,
  lists: () => [...SCALE_KEYS.all, "list"] as const,
  detail: (id: string) => [...SCALE_KEYS.all, "detail", id] as const,
};

export function useScales() {
  return useQuery({
    queryKey: SCALE_KEYS.lists(),
    queryFn: () => scaleApi.getScales(),
  });
}

export function useScale(id: string) {
  return useQuery({
    queryKey: SCALE_KEYS.detail(id),
    queryFn: () => scaleApi.getScaleById(id),
    enabled: Boolean(id),
  });
}

export function useCreateScale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PayScaleFormData) => scaleApi.createScale(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SCALE_KEYS.all }),
  });
}

export function useUpdateScale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PayScaleFormData> }) =>
      scaleApi.updateScale(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SCALE_KEYS.all }),
  });
}

export function useToggleScaleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scaleApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SCALE_KEYS.all }),
  });
}
