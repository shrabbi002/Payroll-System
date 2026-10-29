import math
from django.core.management.base import BaseCommand
from payroll.models import (
    EmployeeTier, PayScale, ScaleLink, SalaryHead, HeadRateVersion,
    PayrollParameters, EmployeeProfile,
)


def compute_suggested_n(total_salary, start, increment, max_n, bank_target_pct=80):
    if increment == 0:
        return 0
    ref80 = round(total_salary * bank_target_pct / 100)
    sum_pct = 0.5 + 0.1
    fixed = 1000
    n_exact = ((ref80 - fixed) / (1 + sum_pct) - start) / increment
    n_low = max(0, min(max_n, math.floor(n_exact)))
    n_high = max(0, min(max_n, math.ceil(n_exact)))

    def bank_for_n(n):
        basic = start + increment * n
        return basic + round(basic * 0.5) + round(basic * 0.1) + 1000

    bank_low = bank_for_n(n_low)
    bank_high = bank_for_n(n_high)
    if abs(bank_high - ref80) < abs(bank_low - ref80):
        return n_high
    return n_low


class Command(BaseCommand):
    help = "Seed ATI Limited payroll data"

    def handle(self, *args, **options):
        if PayScale.objects.exists():
            self.stdout.write(self.style.WARNING("Data already seeded. Skipping."))
            return

        self.stdout.write("Seeding pay scales...")
        scale_data = [
            (9000, 800, 15),
            (10000, 900, 20),
            (12000, 1000, 20),
            (15000, 1100, 25),
        ]
        scales = {}
        for start, inc, nmax in scale_data:
            s = PayScale(start_amount=start, increment_amount=inc, max_increments=nmax,
                         effective_from="2025-07-01", approval_status="Approved")
            s.save()
            scales[f"{start}-{inc}"] = s

        self.stdout.write("Seeding salary heads...")
        head_data = [
            ("HR", "House Rent", "H/R", "PercentageOfBasic", 50, 1),
            ("MA", "Medical Allowance", "M/A", "PercentageOfBasic", 10, 2),
            ("CONV", "Conveyance", "Conveyance", "Fixed", 1000, 3),
        ]
        for code, name, label, calc, value, order in head_data:
            h = SalaryHead.objects.create(
                code=code, name=name, display_label=label,
                calculation_type=calc, part_of_bank_salary=True,
                show_on_payslip=True, show_on_certificate=(code != "CONV"),
                display_order=order,
            )
            HeadRateVersion.objects.create(
                head=h, value=value, effective_from="2025-07-01",
                approval_status="Approved",
            )

        self.stdout.write("Seeding tiers...")
        tier_data = [
            ("T-SUPPORT", "Support Staff", "Office support and maintenance", "SUPPORT", 1, "9000-800"),
            ("T-JUNIOR", "Junior Officer", "Junior officers and assistants", "JR_OFFICER", 2, "10000-900"),
            ("T-SENIOR", "Senior Officer", "Senior officers and supervisors", "SR_OFFICER", 3, "12000-1000"),
            ("T-MANAGER", "Manager", "Department managers and above", "MANAGER", 4, "15000-1100"),
        ]
        tiers = {}
        for code, name, desc, erp, order, scale_key in tier_data:
            t = EmployeeTier.objects.create(
                code=code, name=name, description=desc,
                erp_designation_code=erp, display_order=order,
            )
            ScaleLink.objects.create(
                tier=t, scale=scales[scale_key],
                effective_from="2025-07-01", approval_status="Approved",
            )
            tiers[code] = (t, scales[scale_key])

        self.stdout.write("Seeding payroll parameters...")
        PayrollParameters.objects.create(
            bank_target_percent=80, rounding_method="HalfUp", rounding_unit="1",
            currency_code="BDT", currency_symbol="৳", payroll_period_type="Monthly",
            variance_tolerance_percent=5, effective_from="2025-07-01",
            approval_status="Approved",
        )

        self.stdout.write("Seeding employee profiles...")
        emp_data = [
            ("ATI-1001", "Md. Rafiqul Islam", "01712345678", "Administration", "Support Staff", "2018-03-15", "T-SUPPORT", 24000),
            ("ATI-1002", "Fatema Begum", "01812345679", "Accounts", "Junior Accountant", "2019-06-01", "T-JUNIOR", 32000),
            ("ATI-1003", "Kamal Hossain", "01912345680", "Operations", "Senior Supervisor", "2016-01-10", "T-SENIOR", 45000),
            ("ATI-1004", "Nasreen Akhter", "01612345681", "HR", "HR Manager", "2015-09-20", "T-MANAGER", 60000),
            ("ATI-1005", "Abdul Karim", "01512345682", "Maintenance", "Peon", "2020-11-05", "T-SUPPORT", 20000),
            ("ATI-1006", "Shamima Sultana", "01312345683", "Finance", "Finance Officer", "2017-04-22", "T-SENIOR", 50000),
        ]
        for eid, name, phone, dept, desig, jdate, tier_code, total in emp_data:
            tier, scale = tiers[tier_code]
            n = compute_suggested_n(total, float(scale.start_amount), float(scale.increment_amount), scale.max_increments)
            EmployeeProfile(
                employee_id=eid, full_name=name, phone=phone, department=dept,
                designation=desig, joining_date=jdate, tier=tier, scale=scale,
                total_salary=total, effective_from="2025-07-01", increment_count=n,
            ).save()

        self.stdout.write(self.style.SUCCESS("ATI Limited seed data created successfully!"))
