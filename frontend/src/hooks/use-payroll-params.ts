import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollParamApi } from "@/services/payroll-param-service";
import { PayrollParametersFormData } from "@/types";

export const PARAM_KEYS = {
  all: ["payroll-parameters"] as const,
};

export function usePayrollParameters() {
  return useQuery({
    queryKey: PARAM_KEYS.all,
    queryFn: () => payrollParamApi.getParameters(),
  });
}

export function useUpdatePayrollParameters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PayrollParametersFormData) =>
      payrollParamApi.updateParameters(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARAM_KEYS.all });
    },
  });
}
