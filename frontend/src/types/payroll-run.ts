import { z } from "zod";

export type RunStatus = "Draft" | "Reviewed" | "Approved" | "Finalized" | "Rejected";

export interface RunGridRow {
  id: string;
  sl: number;
  employeeId: string;
  fullName: string;
  designation: string;
  tierName: string;
  scaleLabel: string;
  incrementAmount: number;
  incrementCount: number;
  totalSalary: number;
  totalIncrement: number;
  basic: number;
  houseRent: number;
  medicalAllowance: number;
  conveyance: number;
  bankSalary: number;
  cashSalary: number;
  eightyPercentAmount: number;
  variance: number;
  check: number;
  flags: string[];
}

export interface ApprovalHistoryEntry {
  action: string;
  userId: string;
  userName: string;
  role: string;
  dateTime: string;
  remarks?: string;
}

export interface PayrollRun {
  id: string;
  runNumber: string;
  periodMonth: string;
  title: string;
  status: RunStatus;
  version: number;
  totalEmployees: number;
  totalSalary: number;
  totalBankSalary: number;
  totalCashSalary: number;
  totalEightyPercentRef: number;
  reconciliationCheck: number;
  errorCount: number;
  warningCount: number;
  items: RunGridRow[];
  approvalHistory: ApprovalHistoryEntry[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export const payrollRunCreateSchema = z.object({
  periodMonth: z.string().min(7, "Period is required (YYYY-MM)"),
  title: z.string().min(1, "Title is required"),
});

export type PayrollRunCreateFormData = z.infer<typeof payrollRunCreateSchema>;
