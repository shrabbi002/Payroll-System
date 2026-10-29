"use client";

import { useState, useEffect } from "react";
import { Users, DollarSign, Building2, TrendingUp, Landmark, Banknote } from "lucide-react";
import { PageHeader } from "@/components/common";
import { useAuth } from "@/lib/auth-context";
import { useTiers } from "@/hooks/use-tiers";
import { useScales } from "@/hooks/use-scales";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { data: tiers = [] } = useTiers();
  const { data: scales = [] } = useScales();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="p-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Loading dashboard...</div>;
  }

  const totalEmployees = tiers.reduce((sum, t) => sum + (t.employeeCount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.fullName || "User"}`}
        description="ATI Limited — Bank/Cash Salary Split Payroll System"
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Employees", value: totalEmployees, color: "var(--primary)" },
          { icon: Building2, label: "Active Tiers", value: tiers.filter((t) => t.isActive).length, color: "var(--success)" },
          { icon: TrendingUp, label: "Pay Scales", value: scales.length, color: "var(--warning-foreground)" },
          { icon: Landmark, label: "Bank Target", value: "80%", color: "var(--primary)" },
        ].map((card) => (
          <div key={card.label} className="p-5 rounded-xl border" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{card.label}</div>
                <div className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{typeof card.value === "number" ? card.value.toLocaleString() : card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Manage Employee Profiles", href: "/payroll/profiles", desc: "Assign total salary and tune bank/cash split" },
              { label: "Create Payroll Run", href: "/payroll/runs", desc: "Generate monthly bank/cash salary grid" },
              { label: "Salary Increment", href: "/payroll/profiles", desc: "Record salary increments with re-tuning" },
              { label: "Generate Payslips", href: "/payslips/generate", desc: "Print Bank and Cash payslips" },
            ].map((action) => (
              <a key={action.label} href={action.href} className="block p-3 rounded-lg border transition-colors hover:bg-black/2.5 dark:hover:bg-white/2.5" style={{ borderColor: "var(--border)" }}>
                <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{action.label}</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{action.desc}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>System Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Organization</span><span className="font-medium" style={{ color: "var(--foreground)" }}>ATI Limited</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Currency</span><span className="font-medium" style={{ color: "var(--foreground)" }}>BDT (৳)</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Bank Target %</span><span className="font-medium" style={{ color: "var(--foreground)" }}>80%</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Variance Tolerance</span><span className="font-medium" style={{ color: "var(--foreground)" }}>5%</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Active Scales</span><span className="font-medium" style={{ color: "var(--foreground)" }}>9000-800, 10000-900, 12000-1000, 15000-1100</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Salary Heads</span><span className="font-medium" style={{ color: "var(--foreground)" }}>H/R (50%), M/A (10%), Conv (৳1,000)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
