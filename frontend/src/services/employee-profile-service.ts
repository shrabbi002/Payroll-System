import type { EmployeeProfile, EmployeeProfileFormData } from "@/types";
import { mockEmployeeProfiles } from "@/lib/mock-data/employee-profiles";

const STORAGE_KEY = "payrollpro_employee_profiles";

function getStored(): EmployeeProfile[] {
  if (typeof window === "undefined") return mockEmployeeProfiles;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEmployeeProfiles));
      return mockEmployeeProfiles;
    }
    return JSON.parse(raw);
  } catch { return mockEmployeeProfiles; }
}

function save(profiles: EmployeeProfile[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)); } catch {}
}

export const employeeProfileApi = {
  async getProfiles(): Promise<EmployeeProfile[]> {
    await new Promise((r) => setTimeout(r, 200));
    return getStored();
  },

  async getProfileById(id: string): Promise<EmployeeProfile | null> {
    await new Promise((r) => setTimeout(r, 100));
    return getStored().find((p) => p.id === id) ?? null;
  },

  async createProfile(data: EmployeeProfileFormData): Promise<EmployeeProfile> {
    await new Promise((r) => setTimeout(r, 300));
    const profiles = getStored();
    if (profiles.some((p) => p.employeeId === data.employeeId)) {
      throw new Error(`Employee "${data.employeeId}" already has a profile`);
    }
    const profile: EmployeeProfile = {
      ...data,
      id: `ep-${Date.now()}`,
      fullName: "",
      joiningDate: "",
      designation: "",
      department: "",
      erpStatus: "Active",
      scaleId: data.scaleId || "",
      basic: 0,
      headBreakdown: [],
      bankSalary: 0,
      cashSalary: 0,
      eightyPercentRef: 0,
      variance: 0,
      check: 0,
      profileStatus: "Pending",
      versions: [],
      warnings: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    save([profile, ...profiles]);
    return profile;
  },

  async updateProfile(id: string, data: Partial<EmployeeProfileFormData>): Promise<EmployeeProfile> {
    await new Promise((r) => setTimeout(r, 300));
    const profiles = getStored();
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Profile not found");
    const existing = profiles[idx]!;
    profiles[idx] = { ...existing, ...data, updatedAt: new Date().toISOString() };
    save(profiles);
    return profiles[idx]!;
  },

  async toggleStatus(id: string): Promise<EmployeeProfile> {
    await new Promise((r) => setTimeout(r, 200));
    const profiles = getStored();
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Profile not found");
    const p = profiles[idx]!;
    p.isActive = !p.isActive;
    p.updatedAt = new Date().toISOString();
    save(profiles);
    return p;
  },
};
