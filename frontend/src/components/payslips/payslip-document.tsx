"use client";

import { Printer, Building2, CheckCircle2 } from "lucide-react";
import { PayslipItem } from "@/types";

interface PayslipDocumentProps {
  payslip: PayslipItem;
  onPrint?: () => void;
}

export function PayslipDocument({ payslip, onPrint }: PayslipDocumentProps) {
  const isBankPayslip = payslip.type === "Bank";

  return (
    <div className="bg-white text-black p-8 max-w-2xl mx-auto text-sm border rounded-xl shadow-sm print:shadow-none print:border-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">ATI Limited</h1>
            <p className="text-xs text-gray-500">Salary Payslip — {payslip.periodMonth}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isBankPayslip ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
            <CheckCircle2 className="w-3 h-3" />
            {payslip.type} Payslip
          </span>
          <div className="text-[10px] text-gray-400 mt-1">Run: {payslip.runNumber}</div>
        </div>
      </div>

      {/* Employee Info */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
        <div><span className="text-gray-500">Employee ID:</span> <strong>{payslip.employeeId}</strong></div>
        <div><span className="text-gray-500">Name:</span> <strong>{payslip.fullName}</strong></div>
        <div><span className="text-gray-500">Designation:</span> {payslip.designation}</div>
        <div><span className="text-gray-500">Department:</span> {payslip.department}</div>
        <div><span className="text-gray-500">Tier:</span> {payslip.tierName}</div>
        <div><span className="text-gray-500">Scale:</span> {payslip.scaleLabel}</div>
      </div>

      {/* Breakdown */}
      {isBankPayslip ? (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Bank Salary Breakdown</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b"><th className="text-left py-1.5">Component</th><th className="text-right py-1.5">Amount (৳)</th></tr>
            </thead>
            <tbody>
              {payslip.basic != null && <tr className="border-b border-gray-100"><td className="py-1.5">Basic Salary</td><td className="text-right font-medium">৳{payslip.basic.toLocaleString()}</td></tr>}
              {payslip.houseRent != null && <tr className="border-b border-gray-100"><td className="py-1.5">House Rent (H/R)</td><td className="text-right font-medium">৳{payslip.houseRent.toLocaleString()}</td></tr>}
              {payslip.medicalAllowance != null && <tr className="border-b border-gray-100"><td className="py-1.5">Medical Allowance (M/A)</td><td className="text-right font-medium">৳{payslip.medicalAllowance.toLocaleString()}</td></tr>}
              {payslip.conveyance != null && <tr className="border-b border-gray-100"><td className="py-1.5">Conveyance</td><td className="text-right font-medium">৳{payslip.conveyance.toLocaleString()}</td></tr>}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t-2"><td className="py-2">Bank Salary</td><td className="text-right text-blue-700">৳{payslip.amount.toLocaleString()}</td></tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-center">
          <div className="text-xs text-gray-600 mb-1">Cash Salary</div>
          <div className="text-2xl font-bold text-green-700">৳{payslip.amount.toLocaleString()}</div>
        </div>
      )}

      {/* Amount in words */}
      <div className="p-3 rounded-lg bg-gray-50 mb-6">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Amount in Words</div>
        <div className="text-xs font-medium text-gray-800">{payslip.amountInWords}</div>
      </div>

      {/* Print button (hidden in print) */}
      {onPrint && (
        <div className="flex justify-end print:hidden">
          <button onClick={onPrint} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      )}
    </div>
  );
}
