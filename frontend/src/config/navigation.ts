import { Permission, type NavSection } from "@/types";

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "setup",
    label: "Setup",
    items: [
      {
        id: "tiers",
        label: "Tier of Employee",
        href: "/setup/tiers",
        icon: "Layers",
        permissions: [Permission.TIER_VIEW],
      },
      {
        id: "scales",
        label: "Pay Scale",
        href: "/setup/scales",
        icon: "TrendingUp",
        permissions: [Permission.SCALE_VIEW],
      },
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    items: [
      {
        id: "salary-heads",
        label: "Salary Heads",
        href: "/payroll/salary-heads",
        icon: "ListTree",
        permissions: [Permission.SALARY_HEAD_VIEW],
      },
      {
        id: "parameters",
        label: "Payroll Parameters",
        href: "/payroll/parameters",
        icon: "Settings2",
        permissions: [Permission.PAYROLL_PARAM_VIEW],
      },
      {
        id: "profiles",
        label: "Employee Profiles",
        href: "/payroll/profiles",
        icon: "Users",
        permissions: [Permission.EMPLOYEE_PROFILE_VIEW],
      },
      {
        id: "worksheet-import",
        label: "Worksheet Migration",
        href: "/payroll/worksheet-import",
        icon: "FileSpreadsheet",
        permissions: [Permission.WORKSHEET_IMPORT],
      },
      {
        id: "runs",
        label: "Payroll Runs",
        href: "/payroll/runs",
        icon: "Play",
        permissions: [Permission.PAYROLL_RUN_VIEW],
      },
    ],
  },
  {
    id: "payslips",
    label: "Payslips",
    items: [
      {
        id: "payslip-generate",
        label: "Generate & Print",
        href: "/payslips/generate",
        icon: "Printer",
        permissions: [Permission.PAYSLIP_GENERATE],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [
      {
        id: "report-catalogue",
        label: "Report Catalogue",
        href: "/reports",
        icon: "BarChart3",
        permissions: [Permission.REPORT_VIEW],
      },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    items: [
      {
        id: "users-roles",
        label: "Users & Roles",
        href: "/admin/users",
        icon: "Shield",
        permissions: [Permission.USER_MANAGE],
      },
      {
        id: "audit-log",
        label: "Audit Log",
        href: "/admin/audit-log",
        icon: "ScrollText",
        permissions: [Permission.AUDIT_LOG_VIEW],
      },
      {
        id: "system-config",
        label: "Configuration",
        href: "/admin/config",
        icon: "Wrench",
        permissions: [Permission.SYSTEM_CONFIG],
      },
    ],
  },
];
