import { QueryClient, QueryCache, MutationCache, type DefaultOptions } from "@tanstack/react-query";
import { STALE_TIME } from "./constants";
import * as Sentry from "@sentry/nextjs";
import { shouldCaptureError } from "@/utils/sentry";

// ============================================================
// React Query – Default Options
// ============================================================
const queryConfig: DefaultOptions = {
  queries: {
    staleTime: STALE_TIME.MEDIUM,
    gcTime: STALE_TIME.LONG,
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
    queryCache: new QueryCache({
      onError: (error) => {
        if (shouldCaptureError(error)) {
          Sentry.captureException(error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (shouldCaptureError(error)) {
          Sentry.captureException(error);
        }
      },
    }),
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

