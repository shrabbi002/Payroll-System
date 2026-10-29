from ninja import NinjaAPI, Router
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import (
    EmployeeTier, PayScale, ScaleLink, SalaryHead, HeadRateVersion,
    PayrollParameters, EmployeeProfile, ProfileVersion, SalaryIncrement,
    PayrollRun, RunGridRow, ApprovalHistory,
)
from .schemas import (
    TierOut, TierIn, ScaleLinkOut, ScaleLinkIn,
    PayScaleOut, PayScaleIn,
    SalaryHeadOut, SalaryHeadIn, HeadRateVersionOut, HeadRateVersionIn,
    PayrollParametersOut, PayrollParametersIn,
    EmployeeProfileOut, EmployeeProfileIn, HeadBreakdownOut,
    SalaryIncrementOut, SalaryIncrementIn,
    PayrollRunOut, PayrollRunCreateIn, RunGridRowOut, ApprovalHistoryOut,
    TransitionIn, PayslipOut, SuccessOut,
)

api = NinjaAPI(urls_namespace="payroll_api")
router = Router()


def dt(val):
    return val.isoformat() if val else None


def flt(val):
    return float(val) if val is not None else 0


# ─── Tiers ──────────────────────────────────────────────────────

def tier_to_out(t):
    cs = t.current_scale
    links = []
    for sl in t.scale_links.select_related("scale").all():
        links.append({
            "id": str(sl.id), "tierId": str(sl.tier_id), "scaleId": str(sl.scale_id),
            "scaleLabel": sl.scale.label, "effectiveFrom": str(sl.effective_from),
            "effectiveTo": str(sl.effective_to) if sl.effective_to else None,
            "approvalStatus": sl.approval_status, "createdAt": dt(sl.created_at),
        })
    return {
        "id": str(t.id), "code": t.code, "name": t.name, "description": t.description,
        "currentScaleLabel": cs.label if cs else None,
        "currentScaleId": str(cs.id) if cs else None,
        "scaleLinks": links,
        "erpDesignationCode": t.erp_designation_code,
        "employeeCount": t.employee_count, "displayOrder": t.display_order,
        "isActive": t.is_active, "createdAt": dt(t.created_at), "updatedAt": dt(t.updated_at),
    }


@router.get("/tiers", response=list[TierOut])
def list_tiers(request):
    return [tier_to_out(t) for t in EmployeeTier.objects.prefetch_related("scale_links__scale").all()]


@router.get("/tiers/{tier_id}", response=TierOut)
def get_tier(request, tier_id: str):
    return tier_to_out(get_object_or_404(EmployeeTier, id=tier_id))


@router.post("/tiers", response=TierOut)
def create_tier(request, payload: TierIn):
    t = EmployeeTier.objects.create(
        code=payload.code, name=payload.name, description=payload.description,
        erp_designation_code=payload.erpDesignationCode,
        display_order=payload.displayOrder, is_active=payload.isActive,
    )
    return tier_to_out(t)


@router.put("/tiers/{tier_id}", response=TierOut)
def update_tier(request, tier_id: str, payload: TierIn):
    t = get_object_or_404(EmployeeTier, id=tier_id)
    t.code = payload.code
    t.name = payload.name
    t.description = payload.description
    t.erp_designation_code = payload.erpDesignationCode
    t.display_order = payload.displayOrder
    t.is_active = payload.isActive
    t.save()
    return tier_to_out(t)


@router.patch("/tiers/{tier_id}/toggle", response=TierOut)
def toggle_tier(request, tier_id: str):
    t = get_object_or_404(EmployeeTier, id=tier_id)
    t.is_active = not t.is_active
    t.save()
    return tier_to_out(t)


@router.post("/tiers/{tier_id}/scale-links", response=ScaleLinkOut)
def create_scale_link(request, tier_id: str, payload: ScaleLinkIn):
    t = get_object_or_404(EmployeeTier, id=tier_id)
    s = get_object_or_404(PayScale, id=payload.scaleId)
    sl = ScaleLink.objects.create(
        tier=t, scale=s, effective_from=payload.effectiveFrom,
        effective_to=payload.effectiveTo,
    )
    return {
        "id": str(sl.id), "tierId": str(sl.tier_id), "scaleId": str(sl.scale_id),
        "scaleLabel": s.label, "effectiveFrom": str(sl.effective_from),
        "effectiveTo": str(sl.effective_to) if sl.effective_to else None,
        "approvalStatus": sl.approval_status, "createdAt": dt(sl.created_at),
    }


# ─── Pay Scales ─────────────────────────────────────────────────

def scale_to_out(s):
    return {
        "id": str(s.id), "code": s.code, "label": s.label,
        "startAmount": flt(s.start_amount), "incrementAmount": flt(s.increment_amount),
        "maxIncrements": s.max_increments,
        "ceilingAmount": flt(s.ceiling_amount) if s.ceiling_amount else None,
        "effectiveFrom": str(s.effective_from),
        "effectiveTo": str(s.effective_to) if s.effective_to else None,
        "approvalStatus": s.approval_status, "isActive": s.is_active,
        "createdAt": dt(s.created_at), "updatedAt": dt(s.updated_at),
    }


@router.get("/scales", response=list[PayScaleOut])
def list_scales(request):
    return [scale_to_out(s) for s in PayScale.objects.all()]


@router.get("/scales/{scale_id}", response=PayScaleOut)
def get_scale(request, scale_id: str):
    return scale_to_out(get_object_or_404(PayScale, id=scale_id))


@router.post("/scales", response=PayScaleOut)
def create_scale(request, payload: PayScaleIn):
    s = PayScale(
        start_amount=payload.startAmount, increment_amount=payload.incrementAmount,
        max_increments=payload.maxIncrements, effective_from=payload.effectiveFrom,
        effective_to=payload.effectiveTo, is_active=payload.isActive,
    )
    s.save()
    return scale_to_out(s)


@router.put("/scales/{scale_id}", response=PayScaleOut)
def update_scale(request, scale_id: str, payload: PayScaleIn):
    s = get_object_or_404(PayScale, id=scale_id)
    s.start_amount = payload.startAmount
    s.increment_amount = payload.incrementAmount
    s.max_increments = payload.maxIncrements
    s.effective_from = payload.effectiveFrom
    s.effective_to = payload.effectiveTo
    s.is_active = payload.isActive
    s.save()
    return scale_to_out(s)


@router.patch("/scales/{scale_id}/toggle", response=PayScaleOut)
def toggle_scale(request, scale_id: str):
    s = get_object_or_404(PayScale, id=scale_id)
    s.is_active = not s.is_active
    s.save()
    return scale_to_out(s)


# ─── Salary Heads ───────────────────────────────────────────────

def head_to_out(h):
    versions = []
    for v in h.rate_versions.all():
        versions.append({
            "id": str(v.id), "headId": str(v.head_id), "value": flt(v.value),
            "effectiveFrom": str(v.effective_from),
            "effectiveTo": str(v.effective_to) if v.effective_to else None,
            "approvalStatus": v.approval_status, "createdAt": dt(v.created_at),
        })
    return {
        "id": str(h.id), "code": h.code, "name": h.name, "displayLabel": h.display_label,
        "calculationType": h.calculation_type, "currentValue": h.current_value,
        "partOfBankSalary": h.part_of_bank_salary,
        "showOnPayslip": h.show_on_payslip, "showOnCertificate": h.show_on_certificate,
        "rateVersions": versions, "displayOrder": h.display_order,
        "isActive": h.is_active, "isLocked": h.is_locked,
        "createdAt": dt(h.created_at), "updatedAt": dt(h.updated_at),
    }


@router.get("/salary-heads", response=list[SalaryHeadOut])
def list_salary_heads(request):
    return [head_to_out(h) for h in SalaryHead.objects.prefetch_related("rate_versions").all()]


@router.get("/salary-heads/{head_id}", response=SalaryHeadOut)
def get_salary_head(request, head_id: str):
    return head_to_out(get_object_or_404(SalaryHead.objects.prefetch_related("rate_versions"), id=head_id))


@router.post("/salary-heads", response=SalaryHeadOut)
def create_salary_head(request, payload: SalaryHeadIn):
    h = SalaryHead.objects.create(
        code=payload.code, name=payload.name, display_label=payload.displayLabel,
        calculation_type=payload.calculationType,
        part_of_bank_salary=payload.partOfBankSalary,
        show_on_payslip=payload.showOnPayslip, show_on_certificate=payload.showOnCertificate,
        display_order=payload.displayOrder, is_active=payload.isActive,
    )
    return head_to_out(h)


@router.put("/salary-heads/{head_id}", response=SalaryHeadOut)
def update_salary_head(request, head_id: str, payload: SalaryHeadIn):
    h = get_object_or_404(SalaryHead, id=head_id)
    h.code = payload.code
    h.name = payload.name
    h.display_label = payload.displayLabel
    h.calculation_type = payload.calculationType
    h.part_of_bank_salary = payload.partOfBankSalary
    h.show_on_payslip = payload.showOnPayslip
    h.show_on_certificate = payload.showOnCertificate
    h.display_order = payload.displayOrder
    h.is_active = payload.isActive
    h.save()
    return head_to_out(h)


@router.patch("/salary-heads/{head_id}/toggle", response=SalaryHeadOut)
def toggle_salary_head(request, head_id: str):
    h = get_object_or_404(SalaryHead, id=head_id)
    h.is_active = not h.is_active
    h.save()
    return head_to_out(h)


@router.post("/salary-heads/{head_id}/rate-versions", response=HeadRateVersionOut)
def create_rate_version(request, head_id: str, payload: HeadRateVersionIn):
    h = get_object_or_404(SalaryHead, id=head_id)
    v = HeadRateVersion.objects.create(
        head=h, value=payload.value, effective_from=payload.effectiveFrom,
        effective_to=payload.effectiveTo,
    )
    return {
        "id": str(v.id), "headId": str(v.head_id), "value": flt(v.value),
        "effectiveFrom": str(v.effective_from),
        "effectiveTo": str(v.effective_to) if v.effective_to else None,
        "approvalStatus": v.approval_status, "createdAt": dt(v.created_at),
    }


# ─── Payroll Parameters ────────────────────────────────────────

def params_to_out(p):
    return {
        "id": str(p.id), "bankTargetPercent": flt(p.bank_target_percent),
        "roundingMethod": p.rounding_method, "roundingUnit": p.rounding_unit,
        "currencyCode": p.currency_code, "currencySymbol": p.currency_symbol,
        "payrollPeriodType": p.payroll_period_type,
        "varianceTolerancePercent": flt(p.variance_tolerance_percent),
        "effectiveFrom": str(p.effective_from) if p.effective_from else None,
        "effectiveTo": str(p.effective_to) if p.effective_to else None,
        "approvalStatus": p.approval_status, "updatedAt": dt(p.updated_at),
    }


@router.get("/parameters", response=PayrollParametersOut)
def get_parameters(request):
    p = PayrollParameters.objects.first()
    if not p:
        p = PayrollParameters.objects.create(effective_from="2025-07-01", approval_status="Approved")
    return params_to_out(p)


@router.put("/parameters", response=PayrollParametersOut)
def update_parameters(request, payload: PayrollParametersIn):
    p = PayrollParameters.objects.first()
    if not p:
        p = PayrollParameters()
    p.bank_target_percent = payload.bankTargetPercent
    p.rounding_method = payload.roundingMethod
    p.rounding_unit = payload.roundingUnit
    p.currency_code = payload.currencyCode
    p.currency_symbol = payload.currencySymbol
    p.payroll_period_type = payload.payrollPeriodType
    p.variance_tolerance_percent = payload.varianceTolerancePercent
    p.effective_from = payload.effectiveFrom
    p.effective_to = payload.effectiveTo
    p.save()
    return params_to_out(p)


# ─── Employee Profiles ─────────────────────────────────────────

def build_head_breakdown(basic):
    heads = SalaryHead.objects.filter(is_active=True, part_of_bank_salary=True).prefetch_related("rate_versions")
    breakdown = []
    for h in heads:
        val = h.current_value
        if h.calculation_type == "PercentageOfBasic":
            amount = round(basic * val / 100)
            formula = f"{val}% of Basic"
        else:
            amount = val
            formula = f"Fixed ৳{int(val):,}"
        breakdown.append({"code": h.code, "label": h.display_label, "amount": amount, "formula": formula})
    return breakdown


def profile_to_out(e):
    basic = flt(e.basic)
    breakdown = build_head_breakdown(basic)
    bank = flt(e.bank_salary)
    cash = flt(e.cash_salary)
    total = flt(e.total_salary)
    warnings = []
    if cash < 0:
        warnings.append("Negative cash salary")
    if basic == flt(e.scale.start_amount):
        warnings.append("Basic at scale minimum")
    if e.scale.max_increments and e.increment_count >= e.scale.max_increments:
        warnings.append("N at maximum increments")
    return {
        "id": str(e.id), "employeeId": e.employee_id, "fullName": e.full_name,
        "phone": e.phone, "joiningDate": str(e.joining_date),
        "designation": e.designation, "department": e.department, "erpStatus": e.erp_status,
        "tierId": str(e.tier_id), "tierName": e.tier.name if e.tier else None,
        "scaleId": str(e.scale_id), "scaleLabel": e.scale.label if e.scale else None,
        "scaleOverride": e.scale_override, "scaleOverrideReason": e.scale_override_reason,
        "totalSalary": total, "effectiveFrom": str(e.effective_from),
        "incrementCount": e.increment_count, "overrideReason": e.override_reason,
        "basic": basic, "headBreakdown": breakdown,
        "bankSalary": bank, "cashSalary": cash,
        "eightyPercentRef": flt(e.eighty_percent_ref), "variance": flt(e.variance),
        "check": round(bank + cash - total, 2),
        "profileStatus": e.profile_status, "warnings": warnings,
        "isActive": e.is_active,
        "createdAt": dt(e.created_at), "updatedAt": dt(e.updated_at),
    }


@router.get("/employees", response=list[EmployeeProfileOut])
def list_employees(request):
    return [profile_to_out(e) for e in EmployeeProfile.objects.select_related("tier", "scale").all()]


@router.get("/employees/{emp_id}", response=EmployeeProfileOut)
def get_employee(request, emp_id: str):
    return profile_to_out(get_object_or_404(EmployeeProfile.objects.select_related("tier", "scale"), id=emp_id))


@router.post("/employees", response=EmployeeProfileOut)
def create_employee(request, payload: EmployeeProfileIn):
    tier = get_object_or_404(EmployeeTier, id=payload.tierId)
    if payload.scaleOverride and payload.scaleId:
        scale = get_object_or_404(PayScale, id=payload.scaleId)
    else:
        scale = tier.current_scale
        if not scale:
            return api.create_response(request, {"detail": "No active scale linked to this tier"}, status=400)
    e = EmployeeProfile(
        employee_id=payload.employeeId, full_name=payload.fullName, phone=payload.phone,
        joining_date=payload.joiningDate, designation=payload.designation,
        department=payload.department, tier=tier, scale=scale,
        scale_override=payload.scaleOverride, scale_override_reason=payload.scaleOverrideReason,
        total_salary=payload.totalSalary, effective_from=payload.effectiveFrom,
        increment_count=payload.incrementCount, override_reason=payload.overrideReason,
    )
    e.save()
    return profile_to_out(e)


@router.put("/employees/{emp_id}", response=EmployeeProfileOut)
def update_employee(request, emp_id: str, payload: EmployeeProfileIn):
    e = get_object_or_404(EmployeeProfile.objects.select_related("tier", "scale"), id=emp_id)
    e.employee_id = payload.employeeId
    e.full_name = payload.fullName
    e.phone = payload.phone
    e.joining_date = payload.joiningDate
    e.designation = payload.designation
    e.department = payload.department
    e.tier_id = payload.tierId
    if payload.scaleOverride and payload.scaleId:
        e.scale_id = payload.scaleId
    e.scale_override = payload.scaleOverride
    e.scale_override_reason = payload.scaleOverrideReason
    e.total_salary = payload.totalSalary
    e.effective_from = payload.effectiveFrom
    e.increment_count = payload.incrementCount
    e.override_reason = payload.overrideReason
    e.save()
    return profile_to_out(e)


@router.patch("/employees/{emp_id}/toggle", response=SuccessOut)
def toggle_employee(request, emp_id: str):
    e = get_object_or_404(EmployeeProfile, id=emp_id)
    e.is_active = not e.is_active
    e.profile_status = "Inactive" if not e.is_active else "Complete"
    e.save(update_fields=["is_active", "profile_status", "updated_at"])
    return {"success": True}


# ─── Salary Increments ─────────────────────────────────────────

def increment_to_out(i):
    return {
        "id": str(i.id), "profileId": str(i.profile_id),
        "employeeId": i.profile.employee_id, "fullName": i.profile.full_name,
        "currentTotal": flt(i.current_total), "incrementAmount": flt(i.increment_amount),
        "newTotal": flt(i.new_total), "reason": i.reason,
        "effectiveFrom": str(i.effective_from), "approvalStatus": i.approval_status,
        "createdBy": i.created_by, "createdAt": dt(i.created_at),
    }


@router.get("/increments", response=list[SalaryIncrementOut])
def list_increments(request):
    return [increment_to_out(i) for i in SalaryIncrement.objects.select_related("profile").all()]


@router.post("/increments", response=SalaryIncrementOut)
def create_increment(request, payload: SalaryIncrementIn):
    p = get_object_or_404(EmployeeProfile, id=payload.profileId)
    i = SalaryIncrement(
        profile=p, current_total=p.total_salary,
        increment_amount=payload.incrementAmount,
        reason=payload.reason, effective_from=payload.effectiveFrom,
        created_by="Payroll Admin",
    )
    i.save()
    return increment_to_out(i)


@router.patch("/increments/{inc_id}/approve", response=SalaryIncrementOut)
def approve_increment(request, inc_id: str, payload: TransitionIn):
    i = get_object_or_404(SalaryIncrement.objects.select_related("profile"), id=inc_id)
    i.approval_status = "Approved"
    i.approved_by = payload.userName
    i.approved_at = timezone.now()
    i.save()
    p = i.profile
    p.total_salary = i.new_total
    p.effective_from = i.effective_from
    p.save()
    ProfileVersion.objects.create(
        profile=p, total_salary=p.total_salary, increment_count=p.increment_count,
        effective_from=p.effective_from, created_by=payload.userName,
    )
    return increment_to_out(i)


# ─── Payroll Runs ───────────────────────────────────────────────

def run_to_out(r, include_items=True):
    items = []
    if include_items:
        for row in r.rows.all():
            items.append({
                "id": str(row.id), "sl": row.sl, "employeeId": row.employee_id,
                "fullName": row.full_name, "designation": row.designation,
                "tierName": row.tier_name, "scaleLabel": row.scale_label,
                "incrementAmount": flt(row.increment_amount), "incrementCount": row.increment_count,
                "totalSalary": flt(row.total_salary), "totalIncrement": flt(row.total_increment),
                "basic": flt(row.basic), "houseRent": flt(row.house_rent),
                "medicalAllowance": flt(row.medical_allowance), "conveyance": flt(row.conveyance),
                "bankSalary": flt(row.bank_salary), "cashSalary": flt(row.cash_salary),
                "eightyPercentAmount": flt(row.eighty_percent_amount),
                "variance": flt(row.variance), "check": flt(row.check_value),
                "flags": row.flags,
            })
    history = []
    for ah in r.approval_history.all():
        history.append({
            "action": ah.action, "userId": ah.user_id, "userName": ah.user_name,
            "role": ah.role, "dateTime": dt(ah.created_at), "remarks": ah.remarks,
        })
    return {
        "id": str(r.id), "runNumber": r.run_number, "periodMonth": r.period_month,
        "title": r.title, "status": r.status, "version": r.version,
        "totalEmployees": r.total_employees, "totalSalary": flt(r.total_salary),
        "totalBankSalary": flt(r.total_bank_salary), "totalCashSalary": flt(r.total_cash_salary),
        "totalEightyPercentRef": flt(r.total_eighty_ref),
        "reconciliationCheck": flt(r.reconciliation_check),
        "errorCount": r.error_count, "warningCount": r.warning_count,
        "items": items, "approvalHistory": history,
        "createdBy": r.created_by, "createdAt": dt(r.created_at), "updatedAt": dt(r.updated_at),
        "rejectionReason": r.rejection_reason,
    }


@router.get("/payroll-runs", response=list[PayrollRunOut])
def list_runs(request):
    return [run_to_out(r, False) for r in PayrollRun.objects.all()]


@router.get("/payroll-runs/{run_id}", response=PayrollRunOut)
def get_run(request, run_id: str):
    return run_to_out(get_object_or_404(PayrollRun.objects.prefetch_related("rows", "approval_history"), id=run_id))


@router.post("/payroll-runs", response=PayrollRunOut)
def create_run(request, payload: PayrollRunCreateIn):
    profiles = EmployeeProfile.objects.filter(is_active=True, profile_status="Complete").select_related("tier", "scale")
    count = PayrollRun.objects.count()
    run = PayrollRun.objects.create(
        run_number=f"PR-{payload.periodMonth.replace('-', '')}-{str(count + 1).zfill(3)}",
        period_month=payload.periodMonth, title=payload.title, created_by="Payroll Admin",
    )
    rows = []
    errors = warnings = 0
    for idx, p in enumerate(profiles, 1):
        basic = flt(p.basic)
        hr = round(basic * 0.5)
        ma = round(basic * 0.1)
        conv = 1000
        bank = basic + hr + ma + conv
        total = flt(p.total_salary)
        cash = total - bank
        ref80 = round(total * 0.8)
        var = bank - ref80
        check = round(bank + cash - total, 2)
        inc_amt = flt(p.scale.increment_amount)
        total_inc = inc_amt * p.increment_count
        flags = []
        if cash < 0:
            flags.append("Negative cash salary")
            errors += 1
        if abs(check) > 0.01:
            flags.append("Reconciliation mismatch")
            errors += 1
        params = PayrollParameters.objects.first()
        tol = flt(params.variance_tolerance_percent) if params else 5
        if abs(var) > total * tol / 100:
            flags.append("Variance exceeds tolerance")
            warnings += 1
        rows.append(RunGridRow(
            run=run, sl=idx, employee_id=p.employee_id, full_name=p.full_name,
            designation=p.designation, tier_name=p.tier.name if p.tier else "",
            scale_label=p.scale.label if p.scale else "",
            increment_amount=inc_amt, increment_count=p.increment_count,
            total_salary=total, total_increment=total_inc,
            basic=basic, house_rent=hr, medical_allowance=ma, conveyance=conv,
            bank_salary=bank, cash_salary=cash, eighty_percent_amount=ref80,
            variance=var, check_value=check, flags=flags,
        ))
    RunGridRow.objects.bulk_create(rows)
    run.total_employees = len(rows)
    run.total_salary = sum(flt(r.total_salary) for r in rows)
    run.total_bank_salary = sum(flt(r.bank_salary) for r in rows)
    run.total_cash_salary = sum(flt(r.cash_salary) for r in rows)
    run.total_eighty_ref = sum(flt(r.eighty_percent_amount) for r in rows)
    run.reconciliation_check = round(run.total_bank_salary + run.total_cash_salary - run.total_salary, 2)
    run.error_count = errors
    run.warning_count = warnings
    run.save()
    return run_to_out(run)


def _transition_run(run_id, status, payload):
    r = get_object_or_404(PayrollRun, id=run_id)
    r.status = status
    if status == "Rejected":
        r.rejection_reason = payload.remarks
        r.version += 1
    r.save()
    ApprovalHistory.objects.create(
        run=r, action=status, user_id=payload.userName, user_name=payload.userName,
        role=payload.role, remarks=payload.remarks,
    )
    return run_to_out(r)


@router.patch("/payroll-runs/{run_id}/review", response=PayrollRunOut)
def review_run(request, run_id: str, payload: TransitionIn):
    return _transition_run(run_id, "Reviewed", payload)


@router.patch("/payroll-runs/{run_id}/approve", response=PayrollRunOut)
def approve_run(request, run_id: str, payload: TransitionIn):
    return _transition_run(run_id, "Approved", payload)


@router.patch("/payroll-runs/{run_id}/finalize", response=PayrollRunOut)
def finalize_run(request, run_id: str, payload: TransitionIn):
    return _transition_run(run_id, "Finalized", payload)


@router.patch("/payroll-runs/{run_id}/reject", response=PayrollRunOut)
def reject_run(request, run_id: str, payload: TransitionIn):
    return _transition_run(run_id, "Rejected", payload)


@router.patch("/payroll-runs/{run_id}/reopen", response=PayrollRunOut)
def reopen_run(request, run_id: str, payload: TransitionIn):
    return _transition_run(run_id, "Draft", payload)


# ─── Payslips ──────────────────────────────────────────────────

def number_to_words_bdt(amount):
    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"]
    tens_w = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
    if amount == 0:
        return "Zero Taka Only"

    def below_thousand(n):
        s = ""
        if n >= 100:
            s += ones[n // 100] + " Hundred "
            n %= 100
        if n >= 20:
            s += tens_w[n // 10] + " "
            n %= 10
        if n > 0:
            s += ones[n] + " "
        return s.strip()

    lakh = amount // 100000
    rem = amount % 100000
    thousand = rem // 1000
    below = rem % 1000
    result = ""
    if lakh > 0:
        result += below_thousand(lakh) + " Lakh "
    if thousand > 0:
        result += below_thousand(thousand) + " Thousand "
    if below > 0:
        result += below_thousand(below) + " "
    return result.strip() + " Taka Only"


@router.get("/payslips", response=list[PayslipOut])
def list_payslips(request, run_id: str = None):
    qs = RunGridRow.objects.select_related("run").all()
    if run_id:
        qs = qs.filter(run_id=run_id)
    results = []
    for row in qs:
        if row.run.status != "Finalized":
            continue
        bank_amount = int(flt(row.bank_salary))
        cash_amount = int(flt(row.cash_salary))
        base = {
            "runId": str(row.run_id), "runNumber": row.run.run_number,
            "periodMonth": row.run.period_month, "employeeId": row.employee_id,
            "fullName": row.full_name, "designation": row.designation,
            "department": "", "tierName": row.tier_name, "scaleLabel": row.scale_label,
            "generatedAt": dt(row.run.updated_at),
        }
        results.append({
            **base, "id": f"ps-bank-{row.id}", "type": "Bank",
            "basic": flt(row.basic), "houseRent": flt(row.house_rent),
            "medicalAllowance": flt(row.medical_allowance), "conveyance": flt(row.conveyance),
            "bankSalary": flt(row.bank_salary), "cashSalary": None,
            "amount": bank_amount, "amountInWords": number_to_words_bdt(bank_amount),
        })
        results.append({
            **base, "id": f"ps-cash-{row.id}", "type": "Cash",
            "basic": None, "houseRent": None, "medicalAllowance": None, "conveyance": None,
            "bankSalary": None, "cashSalary": flt(row.cash_salary),
            "amount": cash_amount, "amountInWords": number_to_words_bdt(cash_amount),
        })
    return results


# ─── Auth stub ─────────────────────────────────────────────────

@router.get("/auth/me")
def auth_me(request):
    return {
        "id": "user-admin-01", "employeeId": "ATI-0001",
        "fullName": "System Admin", "email": "admin@atilimited.com",
        "role": "SYSTEM_ADMIN", "avatarUrl": None,
        "organizationId": "org-ati", "organizationName": "ATI Limited",
    }


api.add_router("/v1", router)
