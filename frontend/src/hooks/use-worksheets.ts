import { useQuery } from "@tanstack/react-query";
import { worksheetApi } from "@/services/worksheet-service";

export const WORKSHEET_KEYS = {
  all: ["worksheets"] as const,
  lists: () => [...WORKSHEET_KEYS.all, "list"] as const,
  detail: (id: string) => [...WORKSHEET_KEYS.all, "detail", id] as const,
};

export function useWorksheetMigrations() {
  return useQuery({ queryKey: WORKSHEET_KEYS.lists(), queryFn: () => worksheetApi.getMigrations() });
}

export function useWorksheetMigration(id: string) {
  return useQuery({ queryKey: WORKSHEET_KEYS.detail(id), queryFn: () => worksheetApi.getMigrationById(id), enabled: Boolean(id) });
}
