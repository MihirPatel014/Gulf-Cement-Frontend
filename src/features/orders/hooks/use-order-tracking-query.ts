import { useQuery } from "@tanstack/react-query";
import { orderApiService } from "../../../services/adapters/orders.api";

export function useOrderTrackingQuery(id: number) {
  return useQuery({
    queryKey: ["order-tracking", id],
    queryFn: () => orderApiService.getOrderTracking(id),
    enabled: !!id
  });
}