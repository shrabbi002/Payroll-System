import type { PayrollParameters, PayrollParametersFormData } from "@/types";

const DEFAULT_PARAMS: PayrollParameters = {
  id: "param-ati-01",
  bankTargetPercent: 80,
  roundingMethod: "HalfUp",
  roundingUnit: "1",
  currencyCode: "BDT",
  currencySymbol: "৳",
  payrollPeriodType: "Monthly",
  varianceTolerancePercent: 5,
  effectiveFrom: "2025-07-01",
  approvalStatus: "Approved",
  updatedAt: "2025-07-01T00:00:00Z",
};

const STORAGE_KEY = "payrollpro_parameters";

function getStored(): PayrollParameters {
  if (typeof window === "undefined") return DEFAULT_PARAMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PARAMS));
      return DEFAULT_PARAMS;
    }
    return JSON.parse(raw);
  } catch { return DEFAULT_PARAMS; }
}

function save(params: PayrollParameters): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(params)); } catch {}
}

export const payrollParamApi = {
  async getParameters(): Promise<PayrollParameters> {
    await new Promise((r) => setTimeout(r, 200));
    return getStored();
  },

  async updateParameters(data: PayrollParametersFormData): Promise<PayrollParameters> {
    await new Promise((r) => setTimeout(r, 300));
    const current = getStored();
    const updated: PayrollParameters = { ...current, ...data, updatedAt: new Date().toISOString() };
    save(updated);
    return updated;
  },
};
