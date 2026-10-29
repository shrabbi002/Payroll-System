import { z } from "zod";
import type { ApprovalStatus } from "./tier";

export type RoundingMethod = "HalfUp" | "RoundUp" | "RoundDown" | "NoRounding";
export type RoundingUnit = "1" | "0.5" | "0.01";
export type PayrollPeriodType = "Monthly";

export interface PayrollParameters {
  id: string;
  bankTargetPercent: number;
  roundingMethod: RoundingMethod;
  roundingUnit: RoundingUnit;
  currencyCode: string;
  currencySymbol: string;
  payrollPeriodType: PayrollPeriodType;
  varianceTolerancePercent: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  updatedAt: string;
}

export const payrollParametersSchema = z.object({
  bankTargetPercent: z
    .number()
    .min(1, "Must be at least 1%")
    .max(100, "Cannot exceed 100%"),
  roundingMethod: z.enum(["HalfUp", "RoundUp", "RoundDown", "NoRounding"]),
  roundingUnit: z.enum(["1", "0.5", "0.01"]),
  currencyCode: z.string().min(2),
  currencySymbol: z.string().min(1),
  payrollPeriodType: z.enum(["Monthly"]),
  varianceTolerancePercent: z
    .number()
    .min(1)
    .max(50),
  effectiveFrom: z.string().min(1, "Effective from is required"),
  effectiveTo: z.string().nullable().optional(),
});

export type PayrollParametersFormData = z.infer<typeof payrollParametersSchema>;
