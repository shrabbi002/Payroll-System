# PayrollPro (ATI Limited) — Feature Status

> **Last Updated:** 2026-10-29
> **System:** Bank/Cash Salary Split Payroll (NOT statutory)
> **Stack:** Next.js 16 (React 19) + Django 5.2 + PostgreSQL 18

## Sprint 1: Foundation (In Progress)

| # | Task | Status |
|---|------|--------|
| 1 | Org name → ATI Limited | ✅ Done |
| 2 | Rewrite all TypeScript types (remove tax/PF/loan, add Bank/Cash/Variance) | ✅ Done |
| 3 | Create payroll calculation engine (tuning algorithm) | ✅ Done |
| 4 | Rewrite mock data (4 scales, 3 heads, 4 tiers, 6 profiles) | ✅ Done |
| 5 | Rewrite all frontend services (remove delete, use new types) | ✅ Done |
| 6 | Rewrite Django models | 🔄 In progress |
| 7 | Rewrite Django API schemas | 🔄 In progress |
| 8 | Rewrite Django API endpoints | 🔄 In progress |
| 9 | Rewrite seed data command | 🔄 In progress |
| 10 | Fix Parameters page (remove statutory fields) | 🔄 In progress |
| 11 | Fix Employee Profiles page (add Bank/Cash columns) | 🔄 In progress |
| 12 | Fix Tiers page (add scale link, remove salary band) | 🔄 In progress |
| 13 | Fix Scales page (remove tier, auto-label) | 🔄 In progress |
| 14 | Fix Salary Heads page (3 heads, rate versions) | 🔄 In progress |
| 15 | Fix Worksheet page (migration tool) | 🔄 In progress |
| 16 | Fix Runs page (Bank/Cash grid) | 🔄 In progress |
| 17 | Fix Payslips page (Bank + Cash payslips) | 🔄 In progress |
| 18 | Fix Dashboard page | 🔄 In progress |
| 19 | Remove all delete buttons across all pages | 🔄 In progress |
| 20 | Connect PostgreSQL | ⏳ Blocked (need password) |

## Sprint 2: Setup Modules

| # | Task | Status |
|---|------|--------|
| 21 | Scale link drawer in Tiers | ⏳ |
| 22 | Rate versions grid in Salary Heads | ⏳ |
| 23 | Effective dating + approval on all setups | ⏳ |
| 24 | ERP designation mapping | ⏳ |

## Sprint 3: Employee Profile (Critical)

| # | Task | Status |
|---|------|--------|
| 25 | ERP employee picker (mock API) | ⏳ |
| 26 | Tuning panel with 80% algorithm | ⏳ |
| 27 | Breakdown display (Bank/Cash/Variance) | ⏳ |
| 28 | Profile versioning + history | ⏳ |

## Sprint 4: Payroll Run + Payslips

| # | Task | Status |
|---|------|--------|
| 29 | Run list + create flow | ⏳ |
| 30 | 20-column Bank/Cash grid | ⏳ |
| 31 | Status flow (Draft→Reviewed→Approved→Finalized) | ⏳ |
| 32 | Validation engine (errors/warnings) | ⏳ |
| 33 | Bank + Cash payslip generation | ⏳ |

## Sprint 5: Remaining

| # | Task | Status |
|---|------|--------|
| 34 | Salary Increment module (new) | ⏳ |
| 35 | Worksheet Migration (one-time import) | ⏳ |
| 36 | Approval history across modules | ⏳ |
| 37 | Connect to PostgreSQL backend | ⏳ |

## What Was Removed

All of these were in the old codebase and have been **deleted**:
- Income tax / TDS
- PF (Provident Fund) — employee & employer
- Gratuity
- Loans & advances
- Attendance / LOP / overtime
- Net pay calculation
- Bank transfer (BEFTN/NPSB)
- Bank advice file
- Bank account number / routing number / TIN
- Disbursement channel
- Delete buttons on all setup screens
