import { getCookie } from "./token-handler";

type FetchOptions = RequestInit & { skipTokenRefresh?: boolean };
const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL;

const serverFetchHelper = async (endpoint: string, options: FetchOptions): Promise<Response> => {
  const { headers, next, cache, skipTokenRefresh, ...restOptions } = options;
  const accessToken = skipTokenRefresh ? null : await getCookie("access-token");
  return fetch((SERVER_API_URL || "") + endpoint, {
    headers: { ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}), ...headers },
    credentials: "include",
    next,
    cache,
    ...restOptions,
  });
};

export const serverFetch = {
  get: (endpoint: string, options: FetchOptions = {}) => serverFetchHelper(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, options: FetchOptions = {}) => serverFetchHelper(endpoint, { ...options, method: "POST" }),
  put: (endpoint: string, options: FetchOptions = {}) => serverFetchHelper(endpoint, { ...options, method: "PUT" }),
  patch: (endpoint: string, options: FetchOptions = {}) => serverFetchHelper(endpoint, { ...options, method: "PATCH" }),
  delete: (endpoint: string, options: FetchOptions = {}) => serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
