"use client";

import { FileText, Printer, Download } from "lucide-react";
import { PageHeader } from "@/components/common";

export default function PayslipsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payslips"
        description="Generate and print Bank and Cash payslips from finalized payroll runs. Each employee gets two payslips per run."
        breadcrumbs={[{ label: "Payslips", href: "/payslips/generate" }, { label: "Generate Payslips" }]}
      />

      <div className="rounded-xl border p-8 text-center space-y-4" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--primary-light)" }}>
          <FileText className="w-8 h-8" style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>No Finalized Runs</h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: "var(--muted-foreground)" }}>
          Payslips are generated from finalized payroll runs. Once a run is finalized, two payslips per employee will be available:
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="p-4 rounded-xl border text-center" style={{ borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold" style={{ color: "var(--primary)" }}>Bank Payslip</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Basic + H/R + M/A + Conveyance</div>
          </div>
          <div className="p-4 rounded-xl border text-center" style={{ borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold text-green-600">Cash Payslip</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Cash Salary amount</div>
          </div>
        </div>
      </div>
    </div>
  );
}
