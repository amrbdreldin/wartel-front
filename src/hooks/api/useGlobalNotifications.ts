import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { apiGet } from "@/lib/api-client";

export interface GlobalNotification {
  id: number;
  message_body: string;
  created_at: string;
}

export interface GlobalNotificationsResponse {
  success: boolean;
  message: string;
  data: GlobalNotification[];
}

export function useGlobalNotifications() {
  const queryClient = useQueryClient();
  const prevDataRef = useRef<string | null>(null);

  const query = useQuery<GlobalNotificationsResponse>({
    queryKey: ["global-notifications"],
    queryFn: () => apiGet<GlobalNotificationsResponse>("/notifications"),
    refetchInterval: 120000, // Poll the API every 2 minutes
    staleTime: 60000,
  });

  // Check for changes and trigger an invalidation to cleanly refetch if data changes
  useEffect(() => {
    if (query.data) {
      const currentDataStr = JSON.stringify(query.data.data);
      if (prevDataRef.current !== null && prevDataRef.current !== currentDataStr) {
        console.log("[useGlobalNotifications] API changes detected, refetching to sync...");
        queryClient.invalidateQueries({ queryKey: ["global-notifications"] });
      }
      prevDataRef.current = currentDataStr;
    }
  }, [query.data, queryClient]);

  return query;
}
