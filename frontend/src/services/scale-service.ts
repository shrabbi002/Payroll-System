import type { PayScale, PayScaleFormData } from "@/types";
import { mockScales } from "@/lib/mock-data/scales";

const STORAGE_KEY = "payrollpro_pay_scales";

function getStored(): PayScale[] {
  if (typeof window === "undefined") return mockScales;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockScales));
      return mockScales;
    }
    return JSON.parse(raw);
  } catch { return mockScales; }
}

function save(scales: PayScale[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(scales)); } catch {}
}

export const scaleApi = {
  async getScales(): Promise<PayScale[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...getStored()];
  },

  async getScaleById(id: string): Promise<PayScale | null> {
    await new Promise((r) => setTimeout(r, 100));
    return getStored().find((s) => s.id === id) ?? null;
  },

  async createScale(data: PayScaleFormData): Promise<PayScale> {
    await new Promise((r) => setTimeout(r, 300));
    const scales = getStored();
    const label = `${data.startAmount}-${data.incrementAmount}`;
    const code = `S-${label}`;
    if (scales.some((s) => s.code === code)) throw new Error(`Scale "${label}" already exists`);
    const scale: PayScale = {
      ...data,
      id: `scale-${Date.now()}`,
      code,
      label,
      ceilingAmount: data.maxIncrements ? data.startAmount + data.incrementAmount * data.maxIncrements : undefined,
      approvalStatus: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    save([...scales, scale]);
    return scale;
  },

  async updateScale(id: string, data: Partial<PayScaleFormData>): Promise<PayScale> {
    await new Promise((r) => setTimeout(r, 300));
    const scales = getStored();
    const idx = scales.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Scale not found");
    const updated = { ...scales[idx]!, ...data, updatedAt: new Date().toISOString() };
    if (data.startAmount !== undefined || data.incrementAmount !== undefined) {
      updated.label = `${updated.startAmount}-${updated.incrementAmount}`;
      updated.code = `S-${updated.label}`;
    }
    scales[idx] = updated;
    save(scales);
    return updated;
  },

  async toggleStatus(id: string): Promise<PayScale> {
    await new Promise((r) => setTimeout(r, 200));
    const scales = getStored();
    const idx = scales.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Scale not found");
    const s = scales[idx]!;
    s.isActive = !s.isActive;
    s.updatedAt = new Date().toISOString();
    save(scales);
    return s;
  },
};
