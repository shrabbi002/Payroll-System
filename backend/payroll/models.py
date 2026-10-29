import uuid
import math
from decimal import Decimal
from django.db import models
from django.contrib.postgres.fields import ArrayField


APPROVAL_CHOICES = [("Draft", "Draft"), ("Approved", "Approved")]
MONEY = dict(max_digits=12, decimal_places=2)


class EmployeeTier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=250, blank=True, default="")
    erp_designation_code = models.CharField(max_length=20, blank=True, default="")
    display_order = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return self.name

    @property
    def employee_count(self):
        return self.profiles.filter(is_active=True).count()

    @property
    def current_scale(self):
        from django.utils import timezone
        today = timezone.now().date()
        link = self.scale_links.filter(
            approval_status="Approved",
            effective_from__lte=today,
        ).filter(
            models.Q(effective_to__isnull=True) | models.Q(effective_to__gte=today)
        ).order_by("-effective_from").first()
        return link.scale if link else None


class PayScale(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True)
    label = models.CharField(max_length=30)
    start_amount = models.DecimalField(**MONEY)
    increment_amount = models.DecimalField(**MONEY)
    max_increments = models.IntegerField(null=True, blank=True)
    ceiling_amount = models.DecimalField(**MONEY, null=True, blank=True)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default="Draft")
    approved_by = models.CharField(max_length=100, blank=True, default="")
    approved_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_amount"]

    def __str__(self):
        return self.label

    def save(self, *args, **kwargs):
        self.label = f"{int(self.start_amount)}-{int(self.increment_amount)}"
        self.code = f"S-{self.label}"
        if self.max_increments and self.increment_amount:
            self.ceiling_amount = self.start_amount + self.increment_amount * self.max_increments
        super().save(*args, **kwargs)


class ScaleLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tier = models.ForeignKey(EmployeeTier, on_delete=models.CASCADE, related_name="scale_links")
    scale = models.ForeignKey(PayScale, on_delete=models.PROTECT, related_name="tier_links")
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default="Draft")
    approved_by = models.CharField(max_length=100, blank=True, default="")
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-effective_from"]

    def __str__(self):
        return f"{self.tier.code} → {self.scale.label}"


class SalaryHead(models.Model):
    CALC_TYPE_CHOICES = [
        ("Fixed", "Fixed Amount"),
        ("PercentageOfBasic", "Percentage of Basic"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=12, unique=True)
    name = models.CharField(max_length=100)
    display_label = models.CharField(max_length=20)
    calculation_type = models.CharField(max_length=20, choices=CALC_TYPE_CHOICES)
    part_of_bank_salary = models.BooleanField(default=True)
    show_on_payslip = models.BooleanField(default=True)
    show_on_certificate = models.BooleanField(default=False)
    display_order = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return self.name

    @property
    def current_value(self):
        from django.utils import timezone
        today = timezone.now().date()
        ver = self.rate_versions.filter(
            approval_status="Approved",
            effective_from__lte=today,
        ).filter(
            models.Q(effective_to__isnull=True) | models.Q(effective_to__gte=today)
        ).order_by("-effective_from").first()
        return float(ver.value) if ver else 0


class HeadRateVersion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    head = models.ForeignKey(SalaryHead, on_delete=models.CASCADE, related_name="rate_versions")
    value = models.DecimalField(**MONEY)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default="Draft")
    approved_by = models.CharField(max_length=100, blank=True, default="")
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-effective_from"]


class PayrollParameters(models.Model):
    ROUNDING_CHOICES = [
        ("HalfUp", "Half Up"),
        ("RoundUp", "Round Up"),
        ("RoundDown", "Round Down"),
        ("NoRounding", "No Rounding"),
    ]
    ROUNDING_UNIT_CHOICES = [
        ("1", "1"),
        ("0.5", "0.5"),
        ("0.01", "0.01"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bank_target_percent = models.DecimalField(max_digits=5, decimal_places=2, default=80)
    rounding_method = models.CharField(max_length=15, choices=ROUNDING_CHOICES, default="HalfUp")
    rounding_unit = models.CharField(max_length=5, choices=ROUNDING_UNIT_CHOICES, default="1")
    currency_code = models.CharField(max_length=5, default="BDT")
    currency_symbol = models.CharField(max_length=5, default="৳")
    payroll_period_type = models.CharField(max_length=10, default="Monthly")
    variance_tolerance_percent = models.DecimalField(max_digits=5, decimal_places=2, default=5)
    effective_from = models.DateField(null=True, blank=True)
    effective_to = models.DateField(null=True, blank=True)
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default="Draft")
    approved_by = models.CharField(max_length=100, blank=True, default="")
    approved_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Payroll Parameters"


class EmployeeProfile(models.Model):
    PROFILE_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Complete", "Complete"),
        ("Inactive", "Inactive"),
    ]
    ERP_STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee_id = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20, blank=True, default="")
    joining_date = models.DateField()
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    erp_status = models.CharField(max_length=10, choices=ERP_STATUS_CHOICES, default="Active")

    tier = models.ForeignKey(EmployeeTier, on_delete=models.PROTECT, related_name="profiles")
    scale = models.ForeignKey(PayScale, on_delete=models.PROTECT, related_name="profiles")
    scale_override = models.BooleanField(default=False)
    scale_override_reason = models.TextField(blank=True, default="")

    total_salary = models.DecimalField(**MONEY)
    effective_from = models.DateField()
    increment_count = models.IntegerField(default=0)
    override_reason = models.TextField(blank=True, default="")

    basic = models.DecimalField(**MONEY, default=0)
    bank_salary = models.DecimalField(**MONEY, default=0)
    cash_salary = models.DecimalField(**MONEY, default=0)
    eighty_percent_ref = models.DecimalField(**MONEY, default=0)
    variance = models.DecimalField(**MONEY, default=0)

    profile_status = models.CharField(max_length=10, choices=PROFILE_STATUS_CHOICES, default="Pending")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["employee_id"]

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"

    def compute_salary(self):
        start = float(self.scale.start_amount)
        inc = float(self.scale.increment_amount)
        n = self.increment_count
        basic = start + inc * n
        heads = SalaryHead.objects.filter(is_active=True, part_of_bank_salary=True)
        head_total = 0
        for h in heads:
            val = h.current_value
            if h.calculation_type == "PercentageOfBasic":
                head_total += round(basic * val / 100)
            else:
                head_total += val
        bank = basic + head_total
        total = float(self.total_salary)
        cash = total - bank
        ref = round(total * 0.8)
        self.basic = Decimal(str(basic))
        self.bank_salary = Decimal(str(bank))
        self.cash_salary = Decimal(str(cash))
        self.eighty_percent_ref = Decimal(str(ref))
        self.variance = Decimal(str(bank - ref))

    def save(self, *args, **kwargs):
        self.compute_salary()
        if self.total_salary and self.increment_count >= 0:
            self.profile_status = "Complete"
        super().save(*args, **kwargs)


class ProfileVersion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name="versions")
    total_salary = models.DecimalField(**MONEY)
    increment_count = models.IntegerField()
    override_reason = models.TextField(blank=True, default="")
    effective_from = models.DateField()
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class SalaryIncrement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(EmployeeProfile, on_delete=models.PROTECT, related_name="increments")
    current_total = models.DecimalField(**MONEY)
    increment_amount = models.DecimalField(**MONEY)
    new_total = models.DecimalField(**MONEY)
    reason = models.TextField()
    effective_from = models.DateField()
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default="Draft")
    approved_by = models.CharField(max_length=100, blank=True, default="")
    approved_at = models.DateTimeField(null=True, blank=True)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        self.new_total = self.current_total + self.increment_amount
        super().save(*args, **kwargs)


class PayrollRun(models.Model):
    STATUS_CHOICES = [
        ("Draft", "Draft"),
        ("Reviewed", "Reviewed"),
        ("Approved", "Approved"),
        ("Finalized", "Finalized"),
        ("Rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    run_number = models.CharField(max_length=30, unique=True)
    period_month = models.CharField(max_length=7)
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="Draft")
    version = models.IntegerField(default=1)
    total_employees = models.IntegerField(default=0)
    total_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_bank_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_cash_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_eighty_ref = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    reconciliation_check = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    error_count = models.IntegerField(default=0)
    warning_count = models.IntegerField(default=0)
    rejection_reason = models.TextField(blank=True, default="")
    created_by = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class RunGridRow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    run = models.ForeignKey(PayrollRun, on_delete=models.CASCADE, related_name="rows")
    sl = models.IntegerField()
    employee_id = models.CharField(max_length=20)
    full_name = models.CharField(max_length=120)
    designation = models.CharField(max_length=100)
    tier_name = models.CharField(max_length=100)
    scale_label = models.CharField(max_length=30)
    increment_amount = models.DecimalField(**MONEY, default=0)
    increment_count = models.IntegerField(default=0)
    total_salary = models.DecimalField(**MONEY, default=0)
    total_increment = models.DecimalField(**MONEY, default=0)
    basic = models.DecimalField(**MONEY, default=0)
    house_rent = models.DecimalField(**MONEY, default=0)
    medical_allowance = models.DecimalField(**MONEY, default=0)
    conveyance = models.DecimalField(**MONEY, default=0)
    bank_salary = models.DecimalField(**MONEY, default=0)
    cash_salary = models.DecimalField(**MONEY, default=0)
    eighty_percent_amount = models.DecimalField(**MONEY, default=0)
    variance = models.DecimalField(**MONEY, default=0)
    check_value = models.DecimalField(**MONEY, default=0)
    flags = ArrayField(models.CharField(max_length=100), default=list)

    class Meta:
        ordering = ["sl"]


class ApprovalHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    run = models.ForeignKey(PayrollRun, on_delete=models.CASCADE, related_name="approval_history", null=True, blank=True)
    content_type = models.CharField(max_length=50, blank=True, default="")
    object_id = models.CharField(max_length=50, blank=True, default="")
    action = models.CharField(max_length=50)
    user_id = models.CharField(max_length=50)
    user_name = models.CharField(max_length=120)
    role = models.CharField(max_length=30)
    remarks = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
