import { UserRole } from "@/interfaces/user-type";

const DASHBOARD_BASE_PATHS: Partial<Record<UserRole, string>> = {
  [UserRole.MESS]: "/mess",
  [UserRole.MEMBER]: "/member",
};

export const getDashboardBasePath = (role: UserRole): string | null =>
  DASHBOARD_BASE_PATHS[role] ?? null;

export const getDefaultDashboardRoute = (role: UserRole): string => {
  const basePath = getDashboardBasePath(role);
  return basePath ? `${basePath}/` : "/";
};
