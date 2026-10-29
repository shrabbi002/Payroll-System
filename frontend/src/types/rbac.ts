export enum UserRole {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  HR_ADMIN = "HR_ADMIN",
  PAYROLL_ADMIN = "PAYROLL_ADMIN",
  FINANCE = "FINANCE",
  MANAGEMENT = "MANAGEMENT",
}

export enum Permission {
  TIER_CREATE = "TIER_CREATE",
  TIER_EDIT = "TIER_EDIT",
  TIER_VIEW = "TIER_VIEW",
  SCALE_CREATE = "SCALE_CREATE",
  SCALE_EDIT = "SCALE_EDIT",
  SCALE_VIEW = "SCALE_VIEW",
  SALARY_HEAD_CREATE = "SALARY_HEAD_CREATE",
  SALARY_HEAD_EDIT = "SALARY_HEAD_EDIT",
  SALARY_HEAD_VIEW = "SALARY_HEAD_VIEW",
  SALARY_HEAD_RATE_APPROVE = "SALARY_HEAD_RATE_APPROVE",
  PAYROLL_PARAM_EDIT = "PAYROLL_PARAM_EDIT",
  PAYROLL_PARAM_VIEW = "PAYROLL_PARAM_VIEW",
  PAYROLL_PARAM_APPROVE = "PAYROLL_PARAM_APPROVE",
  EMPLOYEE_PROFILE_VIEW = "EMPLOYEE_PROFILE_VIEW",
  EMPLOYEE_PROFILE_EDIT = "EMPLOYEE_PROFILE_EDIT",
  EMPLOYEE_TUNE = "EMPLOYEE_TUNE",
  PAYROLL_RUN_CREATE = "PAYROLL_RUN_CREATE",
  PAYROLL_RUN_EDIT_DRAFT = "PAYROLL_RUN_EDIT_DRAFT",
  PAYROLL_RUN_SUBMIT = "PAYROLL_RUN_SUBMIT",
  PAYROLL_RUN_REVIEW = "PAYROLL_RUN_REVIEW",
  PAYROLL_RUN_APPROVE = "PAYROLL_RUN_APPROVE",
  PAYROLL_RUN_FINALIZE = "PAYROLL_RUN_FINALIZE",
  PAYROLL_RUN_REOPEN = "PAYROLL_RUN_REOPEN",
  PAYROLL_RUN_VIEW = "PAYROLL_RUN_VIEW",
  INCREMENT_CREATE = "INCREMENT_CREATE",
  INCREMENT_APPROVE = "INCREMENT_APPROVE",
  INCREMENT_VIEW = "INCREMENT_VIEW",
  PAYSLIP_GENERATE = "PAYSLIP_GENERATE",
  PAYSLIP_VIEW = "PAYSLIP_VIEW",
  REPORT_VIEW = "REPORT_VIEW",
  REPORT_EXPORT = "REPORT_EXPORT",
  WORKSHEET_IMPORT = "WORKSHEET_IMPORT",
  USER_MANAGE = "USER_MANAGE",
  AUDIT_LOG_VIEW = "AUDIT_LOG_VIEW",
  SYSTEM_CONFIG = "SYSTEM_CONFIG",
}

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.SYSTEM_ADMIN]: Object.values(Permission),

  [UserRole.HR_ADMIN]: [
    Permission.TIER_CREATE, Permission.TIER_EDIT, Permission.TIER_VIEW,
    Permission.SCALE_CREATE, Permission.SCALE_EDIT, Permission.SCALE_VIEW,
    Permission.SALARY_HEAD_CREATE, Permission.SALARY_HEAD_EDIT, Permission.SALARY_HEAD_VIEW,
    Permission.PAYROLL_PARAM_EDIT, Permission.PAYROLL_PARAM_VIEW,
    Permission.EMPLOYEE_PROFILE_VIEW, Permission.EMPLOYEE_PROFILE_EDIT, Permission.EMPLOYEE_TUNE,
    Permission.PAYROLL_RUN_VIEW,
    Permission.INCREMENT_CREATE, Permission.INCREMENT_VIEW,
    Permission.PAYSLIP_VIEW,
    Permission.REPORT_VIEW, Permission.REPORT_EXPORT,
    Permission.WORKSHEET_IMPORT,
  ],

  [UserRole.PAYROLL_ADMIN]: [
    Permission.TIER_VIEW, Permission.SCALE_VIEW,
    Permission.SALARY_HEAD_VIEW, Permission.PAYROLL_PARAM_VIEW,
    Permission.EMPLOYEE_PROFILE_VIEW, Permission.EMPLOYEE_PROFILE_EDIT, Permission.EMPLOYEE_TUNE,
    Permission.PAYROLL_RUN_CREATE, Permission.PAYROLL_RUN_EDIT_DRAFT,
    Permission.PAYROLL_RUN_SUBMIT, Permission.PAYROLL_RUN_FINALIZE, Permission.PAYROLL_RUN_VIEW,
    Permission.INCREMENT_CREATE, Permission.INCREMENT_VIEW,
    Permission.PAYSLIP_GENERATE, Permission.PAYSLIP_VIEW,
    Permission.REPORT_VIEW, Permission.REPORT_EXPORT,
    Permission.WORKSHEET_IMPORT,
  ],

  [UserRole.FINANCE]: [
    Permission.TIER_VIEW, Permission.SCALE_VIEW,
    Permission.SALARY_HEAD_VIEW, Permission.PAYROLL_PARAM_VIEW,
    Permission.EMPLOYEE_PROFILE_VIEW,
    Permission.PAYROLL_RUN_REVIEW, Permission.PAYROLL_RUN_VIEW,
    Permission.INCREMENT_VIEW,
    Permission.PAYSLIP_VIEW,
    Permission.REPORT_VIEW, Permission.REPORT_EXPORT,
  ],

  [UserRole.MANAGEMENT]: [
    Permission.TIER_VIEW, Permission.SCALE_VIEW,
    Permission.SALARY_HEAD_VIEW, Permission.SALARY_HEAD_RATE_APPROVE,
    Permission.PAYROLL_PARAM_VIEW, Permission.PAYROLL_PARAM_APPROVE,
    Permission.EMPLOYEE_PROFILE_VIEW,
    Permission.PAYROLL_RUN_APPROVE, Permission.PAYROLL_RUN_REOPEN, Permission.PAYROLL_RUN_VIEW,
    Permission.INCREMENT_APPROVE, Permission.INCREMENT_VIEW,
    Permission.PAYSLIP_VIEW,
    Permission.REPORT_VIEW, Permission.REPORT_EXPORT,
    Permission.AUDIT_LOG_VIEW,
  ],
};

export interface AuthUser {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
  organizationName: string;
}

export type RunStatus = "Draft" | "Reviewed" | "Approved" | "Finalized" | "Rejected";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  permissions: Permission[];
  phase2?: boolean;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}
