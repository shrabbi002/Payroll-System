import type { SalaryHead, SalaryHeadFormData } from "@/types";
import { mockSalaryHeads } from "@/lib/mock-data/salary-heads";

const STORAGE_KEY = "payrollpro_salary_heads";

function getStored(): SalaryHead[] {
  if (typeof window === "undefined") return mockSalaryHeads;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSalaryHeads));
      return mockSalaryHeads;
    }
    return JSON.parse(raw);
  } catch { return mockSalaryHeads; }
}

function save(heads: SalaryHead[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(heads)); } catch {}
}

export const salaryHeadApi = {
  async getSalaryHeads(): Promise<SalaryHead[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...getStored()].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getSalaryHeadById(id: string): Promise<SalaryHead | null> {
    await new Promise((r) => setTimeout(r, 100));
    return getStored().find((h) => h.id === id) ?? null;
  },

  async createSalaryHead(data: SalaryHeadFormData): Promise<SalaryHead> {
    await new Promise((r) => setTimeout(r, 300));
    const heads = getStored();
    if (heads.some((h) => h.code === data.code)) throw new Error(`Code "${data.code}" exists`);
    const head: SalaryHead = {
      ...data,
      id: `head-${Date.now()}`,
      currentValue: 0,
      rateVersions: [],
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    save([...heads, head]);
    return head;
  },

  async updateSalaryHead(id: string, data: Partial<SalaryHeadFormData>): Promise<SalaryHead> {
    await new Promise((r) => setTimeout(r, 300));
    const heads = getStored();
    const idx = heads.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error("Salary head not found");
    heads[idx] = { ...heads[idx]!, ...data, updatedAt: new Date().toISOString() };
    save(heads);
    return heads[idx]!;
  },

  async toggleStatus(id: string): Promise<SalaryHead> {
    await new Promise((r) => setTimeout(r, 200));
    const heads = getStored();
    const idx = heads.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error("Salary head not found");
    const h = heads[idx]!;
    h.isActive = !h.isActive;
    h.updatedAt = new Date().toISOString();
    save(heads);
    return h;
  },
};
