import type { PayrollRun } from "@/types";
import { mockPayrollRuns } from "@/lib/mock-data/payroll-runs";

let runs = [...mockPayrollRuns];

export const payrollRunApi = {
  async getRuns(): Promise<PayrollRun[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...runs];
  },

  async getRunById(id: string): Promise<PayrollRun | null> {
    await new Promise((r) => setTimeout(r, 100));
    return runs.find((r) => r.id === id) ?? null;
  },

  async submitForReview(runId: string): Promise<PayrollRun> {
    await new Promise((r) => setTimeout(r, 200));
    const run = runs.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");
    run.status = "Reviewed";
    return { ...run };
  },

  async approveRun(runId: string): Promise<PayrollRun> {
    await new Promise((r) => setTimeout(r, 200));
    const run = runs.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");
    run.status = "Approved";
    return { ...run };
  },

  async finalizeRun(runId: string): Promise<PayrollRun> {
    await new Promise((r) => setTimeout(r, 200));
    const run = runs.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");
    run.status = "Finalized";
    return { ...run };
  },

  async rejectRun(runId: string, reason: string): Promise<PayrollRun> {
    await new Promise((r) => setTimeout(r, 200));
    const run = runs.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");
    run.status = "Rejected";
    run.rejectionReason = reason;
    return { ...run };
  },
};
