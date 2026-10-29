import { z } from "zod";

export type MigrationRowStatus = "Mapped" | "Unmapped" | "Error" | "Warning";

export interface MigrationRow {
  rowIndex: number;
  excelName: string;
  excelTotalSalary: number;
  excelN: number;
  mappedEmployeeId?: string;
  mappedEmployeeName?: string;
  status: MigrationRowStatus;
  issues: string[];
  // Recalculated by system
  basic?: number;
  bankSalary?: number;
  cashSalary?: number;
  eightyPercentRef?: number;
  variance?: number;
  check?: number;
  overrideReason?: string;
}

export interface WorksheetMigration {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  status: "Uploaded" | "Mapping" | "Validated" | "Imported" | "Failed";
  totalRows: number;
  mappedRows: number;
  errorRows: number;
  warningRows: number;
  baselineTotalSalary: number;
  baselineBankSalary: number;
  baselineCashSalary: number;
  systemTotalSalary: number;
  systemBankSalary: number;
  systemCashSalary: number;
  rows: MigrationRow[];
}
