import { z } from "zod";
import type { ApprovalStatus } from "./tier";
import type { TuningCandidate } from "./employee-profile";

export interface SalaryIncrement {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  tierName: string;
  scaleLabel: string;
  currentTotalSalary: number;
  incrementAmount: number;
  newTotalSalary: number;
  reason: string;
  effectiveFrom: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  suggestedN: number;
  tuningCandidates: TuningCandidate[];
  newBasic: number;
  newBankSalary: number;
  newCashSalary: number;
  newVariance: number;
  createdBy: string;
  createdAt: string;
}

export const salaryIncrementSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  incrementAmount: z
    .number()
    .min(1, "Increment must be greater than 0"),
  reason: z.string().min(1, "Reason is required"),
  effectiveFrom: z.string().min(1, "Effective from is required"),
});

export type SalaryIncrementFormData = z.infer<typeof salaryIncrementSchema>;
