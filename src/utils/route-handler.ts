import { UserRole } from "@/interfaces/user-type";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes: string[] = [
  "/signin",
  "/signup/member",
  "/signup/mess",
];

export const messProtectedRoutes: RouteConfig = {
  patterns: [/^\/mess(\/.*)?$/],
  exact: [],
};

export const memberProtectedRoutes: RouteConfig = {
  patterns: [/^\/member(\/.*)?$/],
  exact: [],
};

export const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.some((route) => route === pathname);
};

export const isRoutesMatches = (
  pathname: string,
  routeConfig: RouteConfig,
): boolean => {
  // Check exact matches
  if (routeConfig.exact.includes(pathname)) {
    return true;
  }
  return routeConfig.patterns.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): "MESS" | "MEMBER" | "COMMON" | null => {
  if (isRoutesMatches(pathname, messProtectedRoutes)) {
    return "MESS";
  }
  if (isRoutesMatches(pathname, memberProtectedRoutes)) {
    return "MEMBER";
  }

  return null;
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  if (routeOwner === role) {
    return true;
  }

  return false;
};
