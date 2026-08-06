import { QueryClient, type DefaultOptions } from "@tanstack/react-query";
import { STALE_TIME } from "./constants";

// ============================================================
// React Query – Default Options
// ============================================================
const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 60_000,   // 1 minute – avoid unnecessary refetches
    gcTime: 300_000,     // 5 minutes – allow GC to reclaim unused query cache
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: 0,
  },
};

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};

// ============================================================
// Create QueryClient singleton
// ============================================================
let queryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a new client
    return createQueryClient();
  }
  // Client: reuse existing
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

