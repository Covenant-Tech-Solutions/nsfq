import { QueryClient } from "@tanstack/react-query";

interface QueryMeta {
  timestamp: number;
  [key: string]: any;
}

// query client with enhanced performance and security settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute before data is considered stale
      gcTime: 5 * 60 * 1000, // 5 minutes before unused data is garbage collected
      retry: 1, // Retry failed queries 3 times
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff with 30s max
      refetchOnWindowFocus: false, // Disable automatic refetching when window regains focus
      refetchOnReconnect: true, // Refetch when reconnecting after losing connection
      refetchOnMount: true, // Refetch when component mounts if data is stale

      // performance tracking
      meta: {
        timestamp: Date.now(),
      } as QueryMeta,
    },
    mutations: {
      retry: 0, // Retry failed mutations twice
      retryDelay: 2000, // 1 second between retries

      onError: (error: Error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

type FetchQueryArgs = Parameters<typeof queryClient.fetchQuery>;

// security interceptors
const originalFetch = queryClient.fetchQuery.bind(queryClient);
queryClient.fetchQuery = ((...args: FetchQueryArgs) => {
  if (args[0] && typeof args[0] === "object") {
    // Sanitize query keys that might contain sensitive data
    const queryKey = "queryKey" in args[0] ? args[0].queryKey : null;
    if (Array.isArray(queryKey)) {
      (args[0] as any).queryKey = queryKey.map((part) =>
        typeof part === "string"
          ? part.replace(/password|token|auth/gi, "[REDACTED]")
          : part,
      );
    }
  }

  return originalFetch(...args).then((result) => {
    return result;
  });
}) as typeof queryClient.fetchQuery;

// Memory management - periodically clear old queries
const cleanupInterval = setInterval(
  () => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryMeta = query.meta as QueryMeta | undefined;
        if (queryMeta && queryMeta.timestamp) {
          // Invalidate queries older than 1 hour
          return Date.now() - queryMeta.timestamp > 60 * 60 * 1000;
        }
        return false;
      },
    });
  },
  30 * 60 * 1000,
); // Check every 30 minutes

// Clean up interval on module unload if needed
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    clearInterval(cleanupInterval);
  });
}

// main query client, that will be use cross the app
export function getQueryClient(): QueryClient {
  return queryClient;
}

// for reset, we need to clear the cache on logout
export function resetQueryClient(): QueryClient {
  queryClient.clear(); // Clear all caches
  return queryClient;
}
