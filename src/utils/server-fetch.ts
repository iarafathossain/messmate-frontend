import { getCookie } from "./token-handler";

type FetchOptions = RequestInit & { skipTokenRefresh?: boolean };

const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL;

const serverFetchHelper = async (
  endpoint: string,
  options: FetchOptions,
): Promise<Response> => {
  const { headers, next, cache, skipTokenRefresh, ...restOptions } = options;

  const accessToken = skipTokenRefresh ? null : await getCookie("accessToken");

  const response = await fetch(`${SERVER_API_URL}${endpoint}`, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    credentials: "include",
    next,
    cache,
    ...restOptions,
  });

  return response;
};

export const serverFetch = {
  get: async (
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),

  post: async (
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),

  put: async (
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),

  patch: async (
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

  delete: async (
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
