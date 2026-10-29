"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  type Permission,
  UserRole,
  ROLE_PERMISSIONS,
} from "@/types";

/* ========================================================================
   Auth Context — Provides current user & permission checking
   ======================================================================== */

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  /**
   * Segregation-of-Duties check (BL-18, BL-23, BL-28):
   * Returns true if the given userId is NOT the current user,
   * meaning the action is allowed (no self-approval).
   */
  canActOn: (targetUserId: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Mock user for development — replace with real JWT auth flow.
 */
const MOCK_USER: AuthUser = {
  id: "usr_001",
  employeeId: "EMP-2025-0001",
  fullName: "Azizul Rahman",
  email: "azizul@payroll.com",
  role: UserRole.PAYROLL_ADMIN,
  organizationId: "org_001",
  organizationName: "ATI Limited",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USER);
  const [isLoading] = useState(false);

  const login = useCallback((newUser: AuthUser) => {
    setUser(newUser);
    // TODO: Store JWT token from Django auth response
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // TODO: Clear JWT token and redirect to login
  }, []);

  const userPermissions = useMemo(() => {
    if (!user) return new Set<Permission>();
    return new Set<Permission>(ROLE_PERMISSIONS[user.role]);
  }, [user]);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return userPermissions.has(permission);
    },
    [userPermissions]
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some((p) => userPermissions.has(p));
    },
    [userPermissions]
  );

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.every((p) => userPermissions.has(p));
    },
    [userPermissions]
  );

  const canActOn = useCallback(
    (targetUserId: string): boolean => {
      if (!user) return false;
      return user.id !== targetUserId;
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canActOn,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canActOn,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access the current auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
