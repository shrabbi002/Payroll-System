import type { TuningCandidate, HeadBreakdown } from "@/types/employee-profile";
import type { SalaryHead } from "@/types/salary-head";

export interface TuningResult {
  candidates: TuningCandidate[];
  suggestedN: number;
  eightyPercentRef: number;
}

export function calculateTuning(
  totalSalary: number,
  scaleStart: number,
  scaleIncrement: number,
  maxIncrements: number,
  bankTargetPercent: number,
): TuningResult {
  const eightyPercentRef = Math.round(totalSalary * bankTargetPercent / 100);
  const nmax = maxIncrements || 0;

  if (scaleIncrement === 0) {
    const basic = scaleStart;
    const bank = computeBankSalary(basic);
    const cash = totalSalary - bank;
    return {
      candidates: [{ n: 0, basic, bankSalary: bank, cashSalary: cash, variance: bank - eightyPercentRef, isSuggested: true }],
      suggestedN: 0,
      eightyPercentRef,
    };
  }

  const sumPercentRates = 0.5 + 0.1;
  const fixedHeadsTotal = 1000;
  const nExact = ((eightyPercentRef - fixedHeadsTotal) / (1 + sumPercentRates) - scaleStart) / scaleIncrement;
  const nLow = Math.max(0, Math.min(nmax, Math.floor(nExact)));
  const nHigh = Math.max(0, Math.min(nmax, Math.ceil(nExact)));

  const candidateNs = [nLow];
  if (nHigh !== nLow) candidateNs.push(nHigh);

  const candidates: TuningCandidate[] = candidateNs.map((n) => {
    const basic = scaleStart + scaleIncrement * n;
    const bank = computeBankSalary(basic);
    const cash = totalSalary - bank;
    return { n, basic, bankSalary: bank, cashSalary: cash, variance: bank - eightyPercentRef, isSuggested: false };
  });

  let suggestedIdx = 0;
  if (candidates.length === 2) {
    const abs0 = Math.abs(candidates[0]!.variance);
    const abs1 = Math.abs(candidates[1]!.variance);
    suggestedIdx = abs1 < abs0 ? 1 : 0;
  }
  candidates[suggestedIdx]!.isSuggested = true;

  return { candidates, suggestedN: candidates[suggestedIdx]!.n, eightyPercentRef };
}

function computeBankSalary(basic: number): number {
  const hr = Math.round(basic * 0.5);
  const ma = Math.round(basic * 0.1);
  const conv = 1000;
  return basic + hr + ma + conv;
}

export function computeBreakdown(
  basic: number,
  heads: SalaryHead[],
): HeadBreakdown[] {
  return heads
    .filter((h) => h.isActive && h.partOfBankSalary)
    .map((h) => {
      const amount =
        h.calculationType === "PercentageOfBasic"
          ? Math.round(basic * h.currentValue / 100)
          : h.currentValue;
      const formula =
        h.calculationType === "PercentageOfBasic"
          ? `${h.currentValue}% of Basic`
          : `Fixed ৳${h.currentValue.toLocaleString()}`;
      return { code: h.code, label: h.displayLabel, amount, formula };
    });
}
