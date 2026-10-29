"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common";

export default function WorksheetMigrationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Worksheet Migration"
        description="One-time migration tool to import employee salary data from the legacy Excel worksheet into the payroll system."
        breadcrumbs={[{ label: "Payroll", href: "/payroll/worksheet-import" }, { label: "Worksheet Migration" }]}
      />

      <div className="rounded-xl border p-8 text-center space-y-4" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--primary-light)" }}>
          <FileSpreadsheet className="w-8 h-8" style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Upload Legacy Salary Sheet</h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: "var(--muted-foreground)" }}>
          Upload an .xlsx file containing Total Salary and N (increment count) per employee. The system will recalculate Basic, Bank Salary, Cash Salary, and 80% Reference for each row.
        </p>

        <div className="border-2 border-dashed rounded-xl p-8 mx-auto max-w-lg" style={{ borderColor: "var(--border)" }}>
          <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--muted-foreground)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Drag and drop your .xlsx file here</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>or click to browse</p>
          <button className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg text-white" style={{ backgroundColor: "var(--primary)" }}>
            Select File
          </button>
        </div>

        <div className="flex items-start gap-2 text-left max-w-lg mx-auto p-3 rounded-lg" style={{ backgroundColor: "var(--warning-light)" }}>
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--warning-foreground)" }} />
          <div className="text-xs" style={{ color: "var(--warning-foreground)" }}>
            <strong>Important:</strong> Each row must be manually mapped to an ERP Employee ID. Names may repeat — never auto-map by name. The system recalculates all values; Excel figures are not trusted.
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--background-card)", borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Expected Baseline Totals (BRD 16.2)</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Total Salary</div>
            <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>৳6,93,500</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Bank Salary</div>
            <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>৳5,62,640</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Cash Salary</div>
            <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>৳1,30,860</div>
          </div>
        </div>
      </div>
    </div>
  );
}
