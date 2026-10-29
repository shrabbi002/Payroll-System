import type { PayslipItem } from "@/types";

export function numberToWordsBDT(amount: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (amount === 0) return "Zero Taka Only";

  function below1000(n: number): string {
    let s = "";
    if (n >= 100) { s += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
    if (n >= 20) { s += tens[Math.floor(n / 10)] + " "; n %= 10; }
    if (n > 0) s += ones[n] + " ";
    return s.trim();
  }

  const lakh = Math.floor(amount / 100000);
  const rem = amount % 100000;
  const thousand = Math.floor(rem / 1000);
  const rest = rem % 1000;
  let result = "";
  if (lakh > 0) result += below1000(lakh) + " Lakh ";
  if (thousand > 0) result += below1000(thousand) + " Thousand ";
  if (rest > 0) result += below1000(rest) + " ";
  return result.trim() + " Taka Only";
}

export const payslipApi = {
  async getPayslips(runId?: string): Promise<PayslipItem[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [];
  },

  async getPayslipById(id: string): Promise<PayslipItem | null> {
    await new Promise((r) => setTimeout(r, 100));
    return null;
  },
};
