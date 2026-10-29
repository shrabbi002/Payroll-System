import type { WorksheetMigration } from "@/types";
import { mockMigrations } from "@/lib/mock-data/worksheets";

let migrations = [...mockMigrations];

export const worksheetApi = {
  async getMigrations(): Promise<WorksheetMigration[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...migrations];
  },

  async getMigrationById(id: string): Promise<WorksheetMigration | null> {
    await new Promise((r) => setTimeout(r, 100));
    return migrations.find((m) => m.id === id) ?? null;
  },
};
