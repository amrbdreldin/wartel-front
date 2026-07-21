import { useQuery } from "@tanstack/react-query";
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
  // Note: The useEffect that called invalidateQueries on data change was removed.
  // It created a self-triggering feedback loop:
  //   data changes → invalidateQueries → refetch → data changes → ...
  // The refetchInterval below handles periodic refresh without this overhead.
  return useQuery<GlobalNotificationsResponse>({
    queryKey: ["global-notifications"],
    queryFn: () => apiGet<GlobalNotificationsResponse>("/notifications"),
    refetchInterval: 300000, // Poll the API every 5 minutes
    staleTime: 0,
  });
}
