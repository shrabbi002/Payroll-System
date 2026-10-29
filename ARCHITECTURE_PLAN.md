# PayrollPro — Architecture Plan (ATI Limited)

> **IMPORTANT:** This document has been superseded by `MASTER_CORRECTION_PLAN.md` which contains the corrected BRD.
> This is NOT a statutory payroll system. It is a **Bank/Cash Salary Split** recording system.

## System Overview

| Component | Technology | Status |
|-----------|-----------|--------|
| Frontend | Next.js 16.4.3, React 19, TanStack Query, React Hook Form + Zod, Tailwind CSS | 🔶 Rebuilding |
| Backend | Django 5.2, Django Ninja API | 🔶 Rebuilding |
| Database | PostgreSQL 18 | ⏳ Pending connection |
| Auth | Mock (Phase 1), Django Auth (Phase 2) | Mock |

## Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   Next.js Frontend   │────▶│  Django Ninja API     │
│   (Port 3000/3001)   │     │  (Port 8000)          │
│                      │     │                       │
│  React 19 + RSC      │     │  /api/v1/tiers        │
│  TanStack Query      │     │  /api/v1/scales       │
│  React Hook Form     │     │  /api/v1/salary-heads │
│  Tailwind CSS        │     │  /api/v1/parameters   │
│                      │     │  /api/v1/profiles     │
│  Currently: mock     │     │  /api/v1/increments   │
│  localStorage data   │     │  /api/v1/runs         │
└──────────────────────┘     │  /api/v1/payslips     │
                             └──────────┬─────────────┘
                                        │
                             ┌──────────▼─────────────┐
                             │    PostgreSQL 18        │
                             │    payroll_db           │
                             └────────────────────────┘
```

## Core Business Logic

```
Total Salary (input)          → Entered per employee with effective date
Basic = Start + Inc × N       → N tuned to hit 80% bank target
Bank Salary = Basic + Σ heads → H/R (50%), M/A (10%), Conv (৳1,000)
Cash Salary = Total − Bank    → Remainder paid in cash
80% Ref = Total × 80%         → Target for bank portion
Variance = Bank − 80% Ref     → Should be near zero
Check = Bank + Cash − Total   → Must be exactly 0
```

## Modules

1. **Tier of Employee** — Groups with scale links, ERP designation mapping
2. **Pay Scale** — Independent scales (9000-800, 10000-900, etc.), effective-dated
3. **Salary Heads** — Bank salary components (H/R, M/A, Conveyance), rate versions
4. **Payroll Parameters** — Bank target %, rounding, variance tolerance
5. **Employee Profile & Tuning** — Total salary input, N tuning, breakdown
6. **Salary Increment** — Increment amounts with re-tuning preview
7. **Worksheet Migration** — One-time import from legacy Excel
8. **Payroll Runs** — Bank/Cash grid, approval workflow, two payslips

## Global Rules

- Organization: **ATI Limited**
- Currency: BDT (৳)
- **No deletions** — Active/Inactive only
- Every setup is **effective-dated** with **Approval Status** (Draft/Approved)
- Employee data from **ERP API** (read-only)
- Calculated fields are **read-only** with formula tooltips
- RBAC: SYSTEM_ADMIN, HR_ADMIN, PAYROLL_ADMIN, FINANCE, MANAGEMENT

See `MASTER_CORRECTION_PLAN.md` for complete details.
