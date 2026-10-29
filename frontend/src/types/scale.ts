import { z } from "zod";
import type { ApprovalStatus } from "./tier";

export interface PayScale {
  id: string;
  code: string;
  label: string;
  startAmount: number;
  incrementAmount: number;
  maxIncrements?: number;
  ceilingAmount?: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const payScaleSchema = z
  .object({
    startAmount: z
      .number()
      .min(1, "Starting amount must be at least ৳1"),
    incrementAmount: z
      .number()
      .min(0, "Increment cannot be negative"),
    maxIncrements: z
      .number()
      .int()
      .min(0)
      .max(50, "Maximum 50 increments")
      .optional(),
    effectiveFrom: z.string().min(1, "Effective from date is required"),
    effectiveTo: z.string().nullable().optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.effectiveTo && data.effectiveFrom) {
        return new Date(data.effectiveTo) >= new Date(data.effectiveFrom);
      }
      return true;
    },
    { message: "Effective To must be on or after Effective From", path: ["effectiveTo"] }
  );

export type PayScaleFormData = z.infer<typeof payScaleSchema>;
