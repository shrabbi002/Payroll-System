import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeProfileApi } from "@/services/employee-profile-service";
import { EmployeeProfileFormData } from "@/types";

export const PROFILE_KEYS = {
  all: ["employee-profiles"] as const,
  lists: () => [...PROFILE_KEYS.all, "list"] as const,
  detail: (id: string) => [...PROFILE_KEYS.all, "detail", id] as const,
};

export function useEmployeeProfiles() {
  return useQuery({
    queryKey: PROFILE_KEYS.lists(),
    queryFn: () => employeeProfileApi.getProfiles(),
  });
}

export function useEmployeeProfile(id: string) {
  return useQuery({
    queryKey: PROFILE_KEYS.detail(id),
    queryFn: () => employeeProfileApi.getProfileById(id),
    enabled: Boolean(id),
  });
}

export function useCreateEmployeeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeProfileFormData) =>
      employeeProfileApi.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useUpdateEmployeeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeProfileFormData> }) =>
      employeeProfileApi.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useToggleProfileStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeProfileApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}
