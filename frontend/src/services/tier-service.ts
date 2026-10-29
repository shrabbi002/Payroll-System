import type { EmployeeTier, EmployeeTierFormData } from "@/types";
import { mockTiers } from "@/lib/mock-data/tiers";

const STORAGE_KEY = "payrollpro_employee_tiers";

function getStored(): EmployeeTier[] {
  if (typeof window === "undefined") return mockTiers;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTiers));
      return mockTiers;
    }
    return JSON.parse(raw);
  } catch { return mockTiers; }
}

function save(tiers: EmployeeTier[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tiers)); } catch {}
}

export const tierApi = {
  async getTiers(): Promise<EmployeeTier[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...getStored()].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getTierById(id: string): Promise<EmployeeTier | null> {
    await new Promise((r) => setTimeout(r, 100));
    return getStored().find((t) => t.id === id) ?? null;
  },

  async createTier(data: EmployeeTierFormData): Promise<EmployeeTier> {
    await new Promise((r) => setTimeout(r, 300));
    const tiers = getStored();
    if (tiers.some((t) => t.code === data.code)) throw new Error(`Code "${data.code}" already exists`);
    const tier: EmployeeTier = {
      ...data,
      id: `tier-${Date.now()}`,
      scaleLinks: [],
      employeeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    save([...tiers, tier]);
    return tier;
  },

  async updateTier(id: string, data: Partial<EmployeeTierFormData>): Promise<EmployeeTier> {
    await new Promise((r) => setTimeout(r, 300));
    const tiers = getStored();
    const idx = tiers.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Tier not found");
    tiers[idx] = { ...tiers[idx]!, ...data, updatedAt: new Date().toISOString() };
    save(tiers);
    return tiers[idx]!;
  },

  async toggleStatus(id: string): Promise<EmployeeTier> {
    await new Promise((r) => setTimeout(r, 200));
    const tiers = getStored();
    const idx = tiers.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Tier not found");
    const t = tiers[idx]!;
    t.isActive = !t.isActive;
    t.updatedAt = new Date().toISOString();
    save(tiers);
    return t;
  },
};
