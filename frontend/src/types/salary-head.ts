import { z } from "zod";
import type { ApprovalStatus } from "./tier";

export type CalculationType = "Fixed" | "PercentageOfBasic";

export interface HeadRateVersion {
  id: string;
  headId: string;
  value: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface SalaryHead {
  id: string;
  code: string;
  name: string;
  displayLabel: string;
  calculationType: CalculationType;
  currentValue: number;
  partOfBankSalary: boolean;
  showOnPayslip: boolean;
  showOnCertificate: boolean;
  rateVersions: HeadRateVersion[];
  displayOrder: number;
  isActive: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export const salaryHeadSchema = z
  .object({
    code: z
      .string()
      .min(2, "Code must be at least 2 characters")
      .max(12, "Code must not exceed 12 characters")
      .regex(/^[A-Z0-9_-]+$/, "Uppercase letters, numbers, dashes only"),
    name: z.string().min(2, "Name is required").max(100),
    displayLabel: z.string().min(1, "Display label is required").max(20),
    calculationType: z.enum(["Fixed", "PercentageOfBasic"]),
    partOfBankSalary: z.boolean(),
    showOnPayslip: z.boolean(),
    showOnCertificate: z.boolean(),
    displayOrder: z.number().int().min(1),
    isActive: z.boolean(),
  });

export type SalaryHeadFormData = z.infer<typeof salaryHeadSchema>;

export const headRateVersionSchema = z.object({
  value: z.number().min(0),
  effectiveFrom: z.string().min(1, "Effective from is required"),
  effectiveTo: z.string().nullable().optional(),
});

export type HeadRateVersionFormData = z.infer<typeof headRateVersionSchema>;
