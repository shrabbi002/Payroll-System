import type { EmployeeProfile } from "@/types/employee-profile";

function buildProfile(
  id: string,
  employeeId: string,
  fullName: string,
  phone: string,
  department: string,
  designation: string,
  joiningDate: string,
  tierId: string,
  tierName: string,
  scaleId: string,
  scaleLabel: string,
  totalSalary: number,
  startAmount: number,
  incrementAmount: number,
  maxIncrements: number,
): EmployeeProfile {
  const bankTarget = 0.8;
  const eightyRef = Math.round(totalSalary * bankTarget);
  const sumPctRates = 0.5 + 0.1;
  const fixedTotal = 1000;

  let n = 0;
  if (incrementAmount > 0) {
    const nExact = ((eightyRef - fixedTotal) / (1 + sumPctRates) - startAmount) / incrementAmount;
    const nLow = Math.max(0, Math.min(maxIncrements, Math.floor(nExact)));
    const nHigh = Math.max(0, Math.min(maxIncrements, Math.ceil(nExact)));
    const bankLow = computeBank(startAmount + incrementAmount * nLow);
    const bankHigh = computeBank(startAmount + incrementAmount * nHigh);
    n = Math.abs(bankHigh - eightyRef) < Math.abs(bankLow - eightyRef) ? nHigh : nLow;
  }

  const basic = startAmount + incrementAmount * n;
  const hr = Math.round(basic * 0.5);
  const ma = Math.round(basic * 0.1);
  const conv = 1000;
  const bankSalary = basic + hr + ma + conv;
  const cashSalary = totalSalary - bankSalary;

  return {
    id,
    employeeId,
    fullName,
    phone,
    joiningDate,
    designation,
    department,
    erpStatus: "Active",
    tierId,
    tierName,
    scaleId,
    scaleLabel,
    scaleOverride: false,
    totalSalary,
    effectiveFrom: "2025-07-01",
    incrementCount: n,
    basic,
    headBreakdown: [
      { code: "HR", label: "H/R", amount: hr, formula: "50% of Basic" },
      { code: "MA", label: "M/A", amount: ma, formula: "10% of Basic" },
      { code: "CONV", label: "Conveyance", amount: conv, formula: "Fixed ৳1,000" },
    ],
    bankSalary,
    cashSalary,
    eightyPercentRef: eightyRef,
    variance: bankSalary - eightyRef,
    check: bankSalary + cashSalary - totalSalary,
    profileStatus: "Complete",
    versions: [],
    warnings: cashSalary < 0 ? ["Negative cash salary"] : [],
    isActive: true,
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2025-07-01T00:00:00Z",
  };
}

function computeBank(basic: number): number {
  return basic + Math.round(basic * 0.5) + Math.round(basic * 0.1) + 1000;
}

export const mockEmployeeProfiles: EmployeeProfile[] = [
  buildProfile("ep-1", "ATI-1001", "Md. Rafiqul Islam", "01712345678", "Administration", "Support Staff", "2018-03-15", "tier-1", "Support Staff", "scale-1", "9000-800", 24000, 9000, 800, 15),
  buildProfile("ep-2", "ATI-1002", "Fatema Begum", "01812345679", "Accounts", "Junior Accountant", "2019-06-01", "tier-2", "Junior Officer", "scale-2", "10000-900", 32000, 10000, 900, 20),
  buildProfile("ep-3", "ATI-1003", "Kamal Hossain", "01912345680", "Operations", "Senior Supervisor", "2016-01-10", "tier-3", "Senior Officer", "scale-3", "12000-1000", 45000, 12000, 1000, 20),
  buildProfile("ep-4", "ATI-1004", "Nasreen Akhter", "01612345681", "HR", "HR Manager", "2015-09-20", "tier-4", "Manager", "scale-4", "15000-1100", 60000, 15000, 1100, 25),
  buildProfile("ep-5", "ATI-1005", "Abdul Karim", "01512345682", "Maintenance", "Peon", "2020-11-05", "tier-1", "Support Staff", "scale-1", "9000-800", 20000, 9000, 800, 15),
  buildProfile("ep-6", "ATI-1006", "Shamima Sultana", "01312345683", "Finance", "Finance Officer", "2017-04-22", "tier-3", "Senior Officer", "scale-3", "12000-1000", 50000, 12000, 1000, 20),
];
