export type PayslipType = "Bank" | "Cash";

export interface PayslipItem {
  id: string;
  runId: string;
  runNumber: string;
  periodMonth: string;
  type: PayslipType;
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  tierName: string;
  scaleLabel: string;
  joiningDate: string;

  // Bank payslip shows breakdown; Cash payslip shows only cashSalary
  basic?: number;
  houseRent?: number;
  medicalAllowance?: number;
  conveyance?: number;
  bankSalary?: number;
  cashSalary?: number;

  amount: number;
  amountInWords: string;

  generatedAt: string;
}
