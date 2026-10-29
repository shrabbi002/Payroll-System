import { z } from "zod";

export type ProfileStatus = "Pending" | "Complete" | "Inactive";

export interface TuningCandidate {
  n: number;
  basic: number;
  bankSalary: number;
  cashSalary: number;
  variance: number;
  isSuggested: boolean;
}

export interface HeadBreakdown {
  code: string;
  label: string;
  amount: number;
  formula: string;
}

export interface ProfileVersion {
  id: string;
  profileId: string;
  totalSalary: number;
  incrementCount: number;
  overrideReason?: string;
  effectiveFrom: string;
  createdAt: string;
  createdBy: string;
}

export interface EmployeeProfile {
  id: string;
  // ERP data (read-only)
  employeeId: string;
  fullName: string;
  phone?: string;
  joiningDate: string;
  designation: string;
  department: string;
  erpStatus: "Active" | "Inactive";

  // Assignment
  tierId: string;
  tierName?: string;
  scaleId: string;
  scaleLabel?: string;
  scaleOverride: boolean;
  scaleOverrideReason?: string;

  // Total Salary & Tuning
  totalSalary: number;
  effectiveFrom: string;
  incrementCount: number;
  overrideReason?: string;

  // Calculated (read-only)
  basic: number;
  headBreakdown: HeadBreakdown[];
  bankSalary: number;
  cashSalary: number;
  eightyPercentRef: number;
  variance: number;
  check: number;

  // Meta
  profileStatus: ProfileStatus;
  versions: ProfileVersion[];
  warnings: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const employeeProfileSchema = z.object({
  employeeId: z.string().min(1, "Select an employee from ERP"),
  tierId: z.string().min(1, "Tier is required"),
  scaleOverride: z.boolean(),
  scaleId: z.string().optional(),
  scaleOverrideReason: z.string().optional(),
  totalSalary: z
    .number()
    .min(1, "Total salary must be greater than 0"),
  effectiveFrom: z.string().min(1, "Effective from is required"),
  incrementCount: z.number().int().min(0),
  overrideReason: z.string().optional(),
});

export type EmployeeProfileFormData = z.infer<typeof employeeProfileSchema>;
