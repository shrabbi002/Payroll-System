# PayrollPro (ATI Limited) — Master Correction & Implementation Plan

> **Date:** 2026-10-29
> **Organization:** ATI Limited
> **Currency:** BDT (৳)
> **System Type:** Bank/Cash Salary Split Payroll (NOT statutory net-pay)

---

## 0. Fundamental Correction

**The entire system was built on a wrong assumption.** It was built as a statutory net-pay payroll
(tax, PF, gratuity, loans, attendance, overtime, net pay, bank transfers). The actual requirement
is a **Bank/Cash salary split system** that:

- Records how much of each employee's salary goes through bank vs cash
- Never transfers money
- Has no income tax, PF, gratuity, loans, advances, attendance, LOP, or overtime
- Uses an **80% bank target** algorithm to tune increment levels

### Core Formula

```
Total Salary         = Entered by Payroll Officer (gross, with effective date)
Basic                = Scale Starting Amount + (Scale Increment × N)
                       N = whole number, 0 ≤ N ≤ Nmax
Head amounts         = From Salary Heads setup (H/R = 50% Basic, M/A = 10% Basic, Conv = ₹1,000)
Bank Salary          = Basic + Σ(heads flagged "Part of Bank Salary")
Cash Salary          = Total Salary − Bank Salary
80% Reference        = Total Salary × Bank Target % (default 80%)
Variance             = Bank Salary − 80% Reference
Check                = Bank Salary + Cash Salary − Total Salary  (must be 0)
```

### Tuning Algorithm (BRD 7.3)

```
N_exact = ((80% Reference − Σ fixed heads) ÷ (1 + Σ % rates) − Start) ÷ Increment
N_low   = floor(N_exact),  capped to [0, Nmax]
N_high  = ceil(N_exact),   capped to [0, Nmax]

For each candidate (N_low, N_high):
  Basic       = Start + Increment × N
  Bank Salary = Basic + Σ heads
  Cash Salary = Total − Bank
  Variance    = Bank − 80% Ref

Suggested N = candidate with smallest |Variance|; tie → lower N
User can override with a mandatory reason.
```

### Test Cases

| Scale    | Total  | Suggested N | Basic  | Bank   | Cash  | Variance | Notes                    |
|----------|--------|-------------|--------|--------|-------|----------|--------------------------|
| 9000-800 | 24,000 | 3           | 11,400 | 19,240 | 4,760 | +40      | BRD 4.3 example          |
| 9000-800 | 20,000 | 0           | 9,000  | 15,400 | 4,600 | -600     | Basic at scale minimum   |
| 10000-900| 70,000 | 27          | 34,300 | 55,880 | 14,120| -120     | High N                   |

---

## 1. Global Rules (Apply Everywhere)

| #  | Rule | Status |
|----|------|--------|
| G1 | Organization name: **ATI Limited** (not Global Enterprises Ltd.) | ❌ Fix |
| G2 | Currency from config. Use ৳ with a font that renders it | ❌ Fix |
| G3 | **Never delete** setup records. Remove all Delete/trash icons. Active/Inactive only | ❌ Fix |
| G4 | Every setup is **effective-dated** with **Approval Status** (Draft / Approved) | ❌ Build |
| G5 | Only Approved values are used in calculations | ❌ Build |
| G6 | Management role approves setups | ❌ Build |
| G7 | Employee ID, name, phone, DOJ, designation, dept, status from **ERP API** (read-only) | ❌ Build |
| G8 | Calculated fields are read-only, show formula on hover | ❌ Build |
| G9 | ONE shared mock data store (no inconsistencies between screens) | ❌ Fix |
| G10| Seed with BRD data: scales 9000-800, 10000-900, 12000-1000, 15000-1100 | ❌ Fix |

---

## 2. Module-by-Module Correction Plan

### Module 1: Tier of Employee

**Current Status:** 🔶 Built but wrong
**Priority:** High

#### What to Remove
- Salary Band / Min Gross Salary / Max Gross Salary (salary governed by Scale, not band)
- Delete/trash icon on every row
- Mandatory ERP designation (make optional)

#### What to Add/Change
| Change | Priority | Status |
|--------|----------|--------|
| "Current Scale" read-only column (label like 9000-800, valid today) | High | ❌ |
| Scale Link drawer per tier: Scale dropdown, Effective From (no overlap), Approval Status, history grid | High | ❌ |
| ERP designation: optional, one designation per ONE active tier (disable in other tiers) | Med | ❌ |
| "Unmapped designations" card/list | Med | ❌ |
| "ERP unavailable – Retry" error state | Med | ❌ |
| Active/Inactive toggle only (no delete) | High | ❌ |
| Filters: code, name, scale, status | Low | ❌ |
| History action (link + mapping history) | Low | ❌ |

#### Seed Data
Replace corporate tiers with ATI Limited tiers linked to scales 9000-800, 10000-900, 12000-1000, 15000-1100.

---

### Module 2: Pay Scale

**Current Status:** 🔶 Built but wrong
**Priority:** High

#### What to Remove
- "Associated Tier" field (Scale is independent; linking done from Tier side)
- Delete/trash icon
- Current formula inconsistency (header says START + INC × STAGES but uses stages−1)

#### What to Add/Change
| Change | Priority | Status |
|--------|----------|--------|
| Remove "Associated Tier" from form and list | High | ❌ |
| Auto-generated Scale Label: `{start}-{increment}` (e.g. 9000-800) | High | ❌ |
| Rename "Number of Stages" → "Maximum Increments (Nmax)", make optional | Med | ❌ |
| Preview: N = 0..Nmax, Basic = Start + Inc × N, Ceiling = Start + Inc × Nmax | Med | ❌ |
| Approval Status (Draft / Approved) | High | ❌ |
| Effective From/To (no overlap for same code) | High | ❌ |
| Allow Increment = 0 (show "tuning skipped" note) | Low | ❌ |

#### Seed Data
| Code | Label | Starting | Increment | Nmax |
|------|-------|----------|-----------|------|
| S-9000-800 | 9000-800 | 9,000 | 800 | 15 |
| S-10000-900 | 10000-900 | 10,000 | 900 | 20 |
| S-12000-1000 | 12000-1000 | 12,000 | 1,000 | 20 |
| S-15000-1100 | 15000-1100 | 15,000 | 1,100 | 25 |

---

### Module 3: Salary Heads

**Current Status:** 🔶 Built but wrong
**Priority:** High

#### What to Remove
- Heads: BASIC, BONUS_FEST, PF_EMPLOYEE, PF_EMPLOYER, TAX_TDS, LOAN_DED
- Classification dropdown (Earning / Deduction / Employer Contribution)
- Disbursement Frequency
- Annual Tax Exemption Limit
- TDS / PF Base / Gratuity Base checkboxes
- Delete/trash icon

#### What to Add/Change
| Change | Priority | Status |
|--------|----------|--------|
| Keep only heads that build Bank Salary | High | ❌ |
| Add "Display Label" field (H/R, M/A) | Med | ❌ |
| Flags: Part of Bank Salary (default ON), Show on Payslip, Show on Certificate | High | ❌ |
| Rate Versions grid: value, Effective From/To, Approval Status | High | ❌ |
| Lock Calculation Type once used in finalized run | Low | ❌ |
| Summary cards: Total heads, % heads, Fixed heads, Part of Bank Salary count | Med | ❌ |

#### Seed Data
| Code | Name | Label | Calc Type | Value | Part of Bank |
|------|------|-------|-----------|-------|-------------|
| HR | House Rent | H/R | % of Basic | 50% | ✅ |
| MA | Medical Allowance | M/A | % of Basic | 10% | ✅ |
| CONV | Conveyance | Conveyance | Fixed | 1,000 | ✅ |

---

### Module 4: Payroll Parameters

**Current Status:** 🔶 Built but completely wrong
**Priority:** High

#### What to Remove (entire sections)
- Tax year, salary cutoff day, disbursement day
- Working days model, standard hours, overtime multiplier
- Weekend days picker
- PF/Gratuity section (employee rate, employer rate, interest, eligibility, basis)
- Payment channel (BEFTN/NPSB/Bank/Cash/Cheque)

#### Rebuild With Only
| Field | Default | Status |
|-------|---------|--------|
| Bank Target % | 80 | ❌ |
| Rounding Method | Half-up | ❌ |
| Rounding Unit | 1 / 0.5 / 0.01 | ❌ |
| Currency Code | BDT | ❌ |
| Currency Symbol | ৳ | ❌ |
| Payroll Period Type | Monthly | ❌ |
| Variance Tolerance % | 5 | ❌ |
| Effective From / To | — | ❌ |
| Approval Status | Draft / Approved | ❌ |
| Version History | — | ❌ |

---

### Module 5: Employee Payroll Profile (CRITICAL — furthest off)

**Current Status:** ❌ Fundamentally wrong
**Priority:** Critical

#### What to Remove
- Hand-typed employee fields (ID, name, email, department, DOJ)
- Designation dropdown (comes from ERP)
- Disbursement channel, bank account, routing number
- TIN, PF checkbox, gratuity checkbox
- "Estimated Net" / "Computed Gross"
- Delete/trash icon
- Manual stage/chip picker

#### Rebuild As "Profile & Tuning" (BRD Screen 3.4)

**Section A — ERP Data (read-only)**
- Employee ID (searchable picker from ERP API)
- Name, Phone (11 digits, 01…), Joining Date, Designation, Department, ERP Status
- Block invalid / duplicate / inactive employees

**Section B — Assignment**
- Tier (dropdown, active tiers; pre-selected from designation mapping)
- Scale (READ-ONLY, inherited from tier)
- "Override scale" toggle → scale dropdown + mandatory reason (audited)

**Section C — Total Salary**
- Total Salary (> 0) + Effective From — **the main input**

**Section D — Tuning Panel** (auto-refresh when Total changes)
- 80% Reference = Total × Bank Target %
- Candidate table: N_low, N_high rows with Basic, Bank, Cash, Variance
- Suggested row highlighted (smallest |variance|, tie → lower N)
- Increment Count N: pick candidate or type value
- Override Reason mandatory if N ≠ suggestion

**Section E — Breakdown (read-only, formula on hover)**
- Basic, H/R, M/A, Conveyance
- **BANK SALARY**, **CASH SALARY** (red if negative)
- Variance, Check (Bank+Cash−Total = 0)
- Warnings: negative cash, Basic at scale minimum, N at maximum, variance > tolerance

**Section F — Save & History**
- Save = new profile version
- History tab: Total Salary versions, N, overrides, timestamps

#### List Page Columns
| Column | Source |
|--------|--------|
| Emp ID | ERP |
| Name | ERP |
| ERP Designation | ERP |
| Tier | Assignment |
| Scale Label | From tier link |
| Total Salary | Input |
| Bank Salary | Calculated |
| Cash Salary | Calculated |
| Variance Flag | Calculated |
| Profile Status | Pending / Complete / Inactive |

**Cards:** Profiles complete/pending, Total Salary sum, Total Bank sum, Total Cash sum

---

### Module 6: Salary Increment (NEW — not built)

**Current Status:** ❌ Missing entirely
**Priority:** High

#### Build New Screen
- Employee (read-only: ID, name, designation, tier, scale)
- Current Total Salary (read-only, as of date)
- Increment Amount (> 0, separate input — never typed over Total Salary)
- Reason (e.g. annual increment, promotion)
- Incremented Total Salary = Current + Increment (read-only)
- Effective From (applies from first payroll period on/after this date; cannot touch finalized run)
- Re-tune Preview (suggested N, Basic, Bank, Cash, Variance on new total)
- Approval Status (Draft / Approved; only Approved creates new Total Salary version)
- Salary History grid (initial total, each increment, resulting total, effective date, approver)
- Buttons: Save / Submit for Approval / Cancel

**Test:** Total 24,000 + increment 2,000 → 26,000; suggested N=4; Bank 20,520; Cash 5,480.

---

### Module 7: Worksheet Import (REPLACE — built for wrong purpose)

**Current Status:** ❌ Wrong purpose (monthly attendance vs one-time migration)
**Priority:** High

#### Replace Completely
- **Purpose:** One-time migration from old Excel salary sheet
- Upload .xlsx: read only Total Salary and N per row (plus name for reference)
- Row-mapping grid: each row → ERP Employee ID chosen and CONFIRMED by user (names repeat; never auto-map by name)
- System recalculates Basic, heads, Bank, Cash, 80% Ref, Variance (Excel values not trusted)
- Issues list: unmapped row, blank reconciliation, Bank+Cash≠Total, row above 80% (override reason needed), duplicate employee
- Baseline totals vs system totals (BRD 16.2: Total 693,500; Bank 562,640; Cash 130,860)
- "Import" creates profile versions

#### Remove
- "Commit to Payroll Run" button
- Attendance, OT, additions, deductions columns
- Payroll month picker
- Monthly upload concept

---

### Module 8: Payroll Runs (MAJOR REBUILD)

**Current Status:** 🔶 Built but wrong grid/logic
**Priority:** Critical

#### Grid Columns (replace entirely)
| # | Column | Source |
|---|--------|--------|
| 1 | Sl | Auto |
| 2 | Emp ID | Profile |
| 3 | Name | Profile |
| 4 | Designation | ERP |
| 5 | Tier | Profile |
| 6 | Scale | Profile |
| 7 | Increment | Profile |
| 8 | N | Profile |
| 9 | Total Salary | Profile |
| 10 | Total Increment | Calculated |
| 11 | Basic | Start + Inc × N |
| 12 | H/R | 50% of Basic |
| 13 | M/A | 10% of Basic |
| 14 | Conveyance | Fixed 1,000 |
| 15 | Bank Salary | Basic + heads |
| 16 | Cash Salary | Total − Bank |
| 17 | 80% Amount | Total × 80% |
| 18 | Variance | Bank − 80% |
| 19 | Check | Bank + Cash − Total |
| 20 | Flags | Warnings/errors |

**Remove:** Gross, OT, Bonus, PF, Tax, LOP, Loan, Net Payable, disbursement bank

#### KPI Cards
- Total Salary · Bank Salary total · Cash Salary total · 80% Reference total
- Reconciliation check (must be 0) · Errors/Warnings count

#### Status Flow
```
Draft → Reviewed (Finance) → Approved (Management) → Finalized (Payroll Admin)
                                                    ↗
Rejected (with remarks) ──────────────→ Draft (new version)
```
- Preparer cannot approve their own run (separation of duties)
- Remove "Disbursed" status

#### Buttons by Status/Role
| Button | Status | Role |
|--------|--------|------|
| Validate | Draft | Payroll Admin |
| Submit for Review | Draft (validated) | Payroll Admin |
| Review | Submitted | Finance |
| Approve | Reviewed | Management |
| Reject (remarks required) | Any pre-finalized | Finance / Management |
| Finalize | Approved | Payroll Admin |
| Request Re-open (reason) | Finalized | Payroll Admin → Mgmt approval |
| Add Adjustment | Draft | Payroll Admin |
| Print Payslips | Finalized | Any viewer |
| Export Excel/PDF | Any | Any viewer |

**Remove:** Bank Advice (BEFTN) button

#### Validation Rules
- **Errors (block Submit):** Missing Total/N/scale, Cash < 0 without override, Bank+Cash≠Total, ERP-inactive, duplicate
- **Warnings (don't block):** Variance > tolerance, Basic at scale minimum, N at max

#### Other
- In Draft only: inline edit Total Salary or N with reason
- Approval History tab: action, user, date/time, remarks
- Run list page: PR-YYYY-NNN, Period, Run Name, Headcount, Status, Version, Created by
- One active run per period

---

### Module 9: Payslips

**Current Status:** 🔶 Built but wrong content
**Priority:** High (after Payroll Run rebuild)

#### Change
- **Two payslips per employee per finalized run:** Bank Payslip and Cash Payslip
- Bank Payslip: Basic, H/R, M/A, Conveyance, Bank Salary total
- Cash Payslip: Cash Salary amount
- Remove: PF, Tax, LOP, Loan, Advance, Net Payable, OT, Bonus

---

## 3. Implementation Priority Order

### Sprint 1: Foundation Fixes (Global + Data Model)
1. ✏️ Change org name to "ATI Limited" everywhere
2. ✏️ Fix currency rendering (৳)
3. ✏️ Remove ALL delete/trash icons across all modules
4. ✏️ Update Django models to match corrected schema
5. ✏️ Create new seed data (BRD scales, heads, test employees)
6. ✏️ Create shared mock data store for frontend

### Sprint 2: Setup Modules (Scales → Heads → Tiers → Params)
7. 🔨 Rebuild Pay Scale (independent, label, Nmax, approval, effective dating)
8. 🔨 Rebuild Salary Heads (3 heads only, rate versions, correct flags)
9. 🔨 Rebuild Tier of Employee (scale link drawer, no salary band)
10. 🔨 Rebuild Payroll Parameters (bank target %, remove statutory fields)

### Sprint 3: Employee Profile (Critical)
11. 🔨 Build ERP employee picker (mock API)
12. 🔨 Build Total Salary input + tuning panel with 80% algorithm
13. 🔨 Build breakdown display (Bank/Cash/Variance)
14. 🔨 Build profile versioning + history
15. 🔨 Build list page with correct columns

### Sprint 4: Payroll Run + Payslips
16. 🔨 Build Run List page with Create Run flow
17. 🔨 Rebuild Run Detail grid (20 columns, totals row)
18. 🔨 Implement status flow with role-based buttons
19. 🔨 Build validation engine (errors/warnings)
20. 🔨 Build two-payslip generation (Bank + Cash)

### Sprint 5: Remaining Modules
21. 🔨 Build Salary Increment module (new)
22. 🔨 Rebuild Worksheet Import (one-time migration)
23. 🔨 Build approval history across all modules
24. 🔨 Connect PostgreSQL backend + migrate frontend to real API

---

## 4. What Gets Deleted From Current Codebase

### Frontend Types to Remove/Rewrite
- `payroll-param.ts` — rebuild with bank target fields only
- `employee-profile.ts` — rebuild with Total Salary, N, Bank/Cash
- `worksheet.ts` — rebuild for migration import
- `payroll-run.ts` — rebuild grid columns
- `payslip.ts` — rebuild for Bank/Cash payslips

### Frontend Components to Remove
- All PF/tax/gratuity/loan/advance fields in forms
- Bank account, TIN, routing number fields
- Attendance/LOP/OT columns in worksheet
- Net Payable everywhere
- Delete buttons/modals on all setup screens

### Backend Models to Rebuild
- `PayrollParameters` — strip statutory fields
- `EmployeeProfile` — add Total Salary, N, remove bank/PF/tax fields
- `WorksheetRow` — replace attendance fields with Total/N
- `PayrollRunItem` — replace with Bank/Cash columns
- Add: `ScaleLink`, `HeadRateVersion`, `ProfileVersion`, `SalaryIncrement`

### Mock Data to Replace
- All 6 tiers → ATI Limited tiers
- All 6 scales → 9000-800, 10000-900, 12000-1000, 15000-1100
- All 9 salary heads → 3 heads (HR, MA, CONV)
- All 6 employee profiles → BRD test employees
- Parameters → bank target 80%, variance 5%

---

## 5. Process Flow Diagrams

### Employee Profile & Tuning Flow
```
ERP Employee Search
       ↓
Select Employee (read-only fields populate)
       ↓
Tier auto-selected from designation mapping
       ↓
Scale inherited from tier (override with reason)
       ↓
Enter Total Salary + Effective From
       ↓
┌──────────────────────────────────────────────┐
│           TUNING PANEL (auto-refresh)         │
│                                               │
│  80% Reference = Total × 80%                 │
│                                               │
│  ┌─────┬────────┬────────┬───────┬──────────┐│
│  │  N  │ Basic  │  Bank  │ Cash  │ Variance ││
│  ├─────┼────────┼────────┼───────┼──────────┤│
│  │ ★ 3 │ 11,400 │ 19,240 │ 4,760 │   +40    ││
│  │   4 │ 12,200 │ 20,580 │ 3,420 │ +1,380   ││
│  └─────┴────────┴────────┴───────┴──────────┘│
│  ★ = Suggested (smallest |variance|)         │
│  Override → mandatory reason                  │
└──────────────────────────────────────────────┘
       ↓
Breakdown: Basic | H/R | M/A | Conv | Bank | Cash | Variance | Check=0
       ↓
Save → New Profile Version
```

### Payroll Run Lifecycle
```
Create Run (pick period)
       ↓
    DRAFT ←──────────── Rejected (remarks)
       ↓                      ↑
  Validate (errors/warnings)  │
       ↓                      │
  Submit for Review           │
       ↓                      │
   REVIEWED (Finance) ────────┘
       ↓                      ↑
   APPROVED (Management) ─────┘
       ↓
   FINALIZED (Payroll Admin)
       ↓
  Generate Bank + Cash Payslips
       ↓
  Export / Print
```

### Worksheet Migration Flow
```
Upload .xlsx (Total Salary + N per row)
       ↓
Row-by-row mapping to ERP Employee IDs (manual confirmation)
       ↓
System recalculates: Basic, Heads, Bank, Cash, 80% Ref, Variance
       ↓
Issues panel: unmapped, Bank+Cash≠Total, over-tolerance, duplicates
       ↓
Resolve issues / add override reasons
       ↓
Compare: Baseline totals vs System totals
       ↓
Import → Creates Employee Profile versions
```
