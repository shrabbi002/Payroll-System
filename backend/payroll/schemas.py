from ninja import Schema
from typing import Optional


class SuccessOut(Schema):
    success: bool = True


# ─── Scale ──────────────────────────────────────────────────────

class PayScaleOut(Schema):
    id: str
    code: str
    label: str
    startAmount: float
    incrementAmount: float
    maxIncrements: Optional[int] = None
    ceilingAmount: Optional[float] = None
    effectiveFrom: str
    effectiveTo: Optional[str] = None
    approvalStatus: str = "Draft"
    isActive: bool
    createdAt: str
    updatedAt: str


class PayScaleIn(Schema):
    startAmount: float
    incrementAmount: float
    maxIncrements: Optional[int] = None
    effectiveFrom: str
    effectiveTo: Optional[str] = None
    isActive: bool = True


# ─── Scale Link ─────────────────────────────────────────────────

class ScaleLinkOut(Schema):
    id: str
    tierId: str
    scaleId: str
    scaleLabel: str
    effectiveFrom: str
    effectiveTo: Optional[str] = None
    approvalStatus: str = "Draft"
    createdAt: str


class ScaleLinkIn(Schema):
    scaleId: str
    effectiveFrom: str
    effectiveTo: Optional[str] = None


# ─── Tier ───────────────────────────────────────────────────────

class TierOut(Schema):
    id: str
    code: str
    name: str
    description: str = ""
    currentScaleLabel: Optional[str] = None
    currentScaleId: Optional[str] = None
    scaleLinks: list[ScaleLinkOut] = []
    erpDesignationCode: str = ""
    employeeCount: int = 0
    displayOrder: int
    isActive: bool
    createdAt: str
    updatedAt: str


class TierIn(Schema):
    code: str
    name: str
    description: str = ""
    erpDesignationCode: str = ""
    displayOrder: int = 1
    isActive: bool = True


# ─── Salary Head ────────────────────────────────────────────────

class HeadRateVersionOut(Schema):
    id: str
    headId: str
    value: float
    effectiveFrom: str
    effectiveTo: Optional[str] = None
    approvalStatus: str = "Draft"
    createdAt: str


class HeadRateVersionIn(Schema):
    value: float
    effectiveFrom: str
    effectiveTo: Optional[str] = None


class SalaryHeadOut(Schema):
    id: str
    code: str
    name: str
    displayLabel: str
    calculationType: str
    currentValue: float = 0
    partOfBankSalary: bool
    showOnPayslip: bool
    showOnCertificate: bool
    rateVersions: list[HeadRateVersionOut] = []
    displayOrder: int
    isActive: bool
    isLocked: bool
    createdAt: str
    updatedAt: str


class SalaryHeadIn(Schema):
    code: str
    name: str
    displayLabel: str
    calculationType: str
    partOfBankSalary: bool = True
    showOnPayslip: bool = True
    showOnCertificate: bool = False
    displayOrder: int = 1
    isActive: bool = True


# ─── Payroll Parameters ─────────────────────────────────────────

class PayrollParametersOut(Schema):
    id: str
    bankTargetPercent: float
    roundingMethod: str
    roundingUnit: str
    currencyCode: str
    currencySymbol: str
    payrollPeriodType: str
    varianceTolerancePercent: float
    effectiveFrom: Optional[str] = None
    effectiveTo: Optional[str] = None
    approvalStatus: str
    updatedAt: str


class PayrollParametersIn(Schema):
    bankTargetPercent: float = 80
    roundingMethod: str = "HalfUp"
    roundingUnit: str = "1"
    currencyCode: str = "BDT"
    currencySymbol: str = "৳"
    payrollPeriodType: str = "Monthly"
    varianceTolerancePercent: float = 5
    effectiveFrom: Optional[str] = None
    effectiveTo: Optional[str] = None


# ─── Employee Profile ───────────────────────────────────────────

class HeadBreakdownOut(Schema):
    code: str
    label: str
    amount: float
    formula: str


class ProfileVersionOut(Schema):
    id: str
    totalSalary: float
    incrementCount: int
    overrideReason: str = ""
    effectiveFrom: str
    createdBy: str
    createdAt: str


class EmployeeProfileOut(Schema):
    id: str
    employeeId: str
    fullName: str
    phone: str = ""
    joiningDate: str
    designation: str
    department: str
    erpStatus: str = "Active"
    tierId: str
    tierName: Optional[str] = None
    scaleId: str
    scaleLabel: Optional[str] = None
    scaleOverride: bool = False
    scaleOverrideReason: str = ""
    totalSalary: float
    effectiveFrom: str
    incrementCount: int
    overrideReason: str = ""
    basic: float
    headBreakdown: list[HeadBreakdownOut] = []
    bankSalary: float
    cashSalary: float
    eightyPercentRef: float
    variance: float
    check: float = 0
    profileStatus: str
    warnings: list[str] = []
    isActive: bool
    createdAt: str
    updatedAt: str


class EmployeeProfileIn(Schema):
    employeeId: str
    fullName: str
    phone: str = ""
    joiningDate: str
    designation: str
    department: str
    tierId: str
    scaleOverride: bool = False
    scaleId: Optional[str] = None
    scaleOverrideReason: str = ""
    totalSalary: float
    effectiveFrom: str
    incrementCount: int = 0
    overrideReason: str = ""


# ─── Salary Increment ───────────────────────────────────────────

class SalaryIncrementOut(Schema):
    id: str
    profileId: str
    employeeId: str
    fullName: str
    currentTotal: float
    incrementAmount: float
    newTotal: float
    reason: str
    effectiveFrom: str
    approvalStatus: str
    createdBy: str
    createdAt: str


class SalaryIncrementIn(Schema):
    profileId: str
    incrementAmount: float
    reason: str
    effectiveFrom: str


# ─── Payroll Run ────────────────────────────────────────────────

class RunGridRowOut(Schema):
    id: str
    sl: int
    employeeId: str
    fullName: str
    designation: str
    tierName: str
    scaleLabel: str
    incrementAmount: float
    incrementCount: int
    totalSalary: float
    totalIncrement: float
    basic: float
    houseRent: float
    medicalAllowance: float
    conveyance: float
    bankSalary: float
    cashSalary: float
    eightyPercentAmount: float
    variance: float
    check: float
    flags: list[str] = []


class ApprovalHistoryOut(Schema):
    action: str
    userId: str
    userName: str
    role: str
    dateTime: str
    remarks: str = ""


class PayrollRunOut(Schema):
    id: str
    runNumber: str
    periodMonth: str
    title: str
    status: str
    version: int
    totalEmployees: int
    totalSalary: float
    totalBankSalary: float
    totalCashSalary: float
    totalEightyPercentRef: float
    reconciliationCheck: float
    errorCount: int
    warningCount: int
    items: list[RunGridRowOut] = []
    approvalHistory: list[ApprovalHistoryOut] = []
    createdBy: str = ""
    createdAt: str
    updatedAt: str
    rejectionReason: str = ""


class PayrollRunCreateIn(Schema):
    periodMonth: str
    title: str


class TransitionIn(Schema):
    userName: str = ""
    role: str = ""
    remarks: str = ""


# ─── Payslip ───────────────────────────────────────────────────

class PayslipOut(Schema):
    id: str
    runId: str
    runNumber: str
    periodMonth: str
    type: str
    employeeId: str
    fullName: str
    designation: str
    department: str
    tierName: str
    scaleLabel: str
    joiningDate: str = ""
    basic: Optional[float] = None
    houseRent: Optional[float] = None
    medicalAllowance: Optional[float] = None
    conveyance: Optional[float] = None
    bankSalary: Optional[float] = None
    cashSalary: Optional[float] = None
    amount: float
    amountInWords: str
    generatedAt: str
