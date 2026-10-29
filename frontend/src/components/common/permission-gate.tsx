"use client";

import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { type Permission } from "@/types";

/* ========================================================================
   PermissionGate — Conditionally renders children based on permissions
   ======================================================================== */

interface PermissionGateProps {
  /** Single permission required to view children */
  permission?: Permission;
  /** Multiple permissions — user needs ANY of these */
  anyOf?: Permission[];
  /** Multiple permissions — user needs ALL of these */
  allOf?: Permission[];
  /** Content to render when the user lacks permission */
  fallback?: ReactNode;
  /** Children to render when permission check passes */
  children: ReactNode;
}

/**
 * Declarative permission boundary component.
 * Renders children only if the current user has the required permission(s).
 *
 * Usage:
 * ```tsx
 * <PermissionGate permission={Permission.PAYROLL_RUN_CREATE}>
 *   <Button>Create Payroll Run</Button>
 * </PermissionGate>
 *
 * <PermissionGate anyOf={[Permission.PAYROLL_RUN_REVIEW, Permission.PAYROLL_RUN_APPROVE]}>
 *   <ApprovalPanel />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let allowed = true;

  if (permission) {
    allowed = hasPermission(permission);
  }

  if (anyOf && allowed) {
    allowed = hasAnyPermission(anyOf);
  }

  if (allOf && allowed) {
    allowed = hasAllPermissions(allOf);
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/* ========================================================================
   SelfActionGuard — Prevents self-approval (BL-18, BL-23, BL-28)
   ======================================================================== */

interface SelfActionGuardProps {
  /** The user ID of the person who prepared/requested the item */
  targetUserId: string;
  /** Content to render when the current user IS the target (action blocked) */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Prevents self-approval actions as required by BRD segregation-of-duties rules.
 * If the current user is the same as the targetUserId, children are not rendered.
 *
 * Usage:
 * ```tsx
 * <SelfActionGuard targetUserId={payrollRun.preparedById}>
 *   <Button>Approve</Button>
 * </SelfActionGuard>
 * ```
 */
export function SelfActionGuard({
  targetUserId,
  fallback = null,
  children,
}: SelfActionGuardProps) {
  const { canActOn } = useAuth();

  if (!canActOn(targetUserId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
