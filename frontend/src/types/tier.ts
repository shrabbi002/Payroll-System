import { z } from "zod";

export type ApprovalStatus = "Draft" | "Approved";

export interface ScaleLink {
  id: string;
  tierId: string;
  scaleId: string;
  scaleLabel: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface EmployeeTier {
  id: string;
  code: string;
  name: string;
  description?: string;
  currentScaleLabel?: string;
  currentScaleId?: string;
  scaleLinks: ScaleLink[];
  erpDesignationCode?: string;
  employeeCount: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const employeeTierSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must not exceed 10 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, and dashes"),
  name: z
    .string()
    .min(2, "Tier name is required")
    .max(100, "Tier name is too long"),
  description: z.string().max(250).optional(),
  erpDesignationCode: z.string().optional(),
  displayOrder: z
    .number()
    .int()
    .min(1, "Display order must be at least 1"),
  isActive: z.boolean(),
});

export type EmployeeTierFormData = z.infer<typeof employeeTierSchema>;

export const scaleLinkSchema = z.object({
  scaleId: z.string().min(1, "Please select a scale"),
  effectiveFrom: z.string().min(1, "Effective from date is required"),
  effectiveTo: z.string().nullable().optional(),
  approvalStatus: z.enum(["Draft", "Approved"]),
});

export type ScaleLinkFormData = z.infer<typeof scaleLinkSchema>;
