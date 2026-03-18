import { useQuery } from "@tanstack/react-query";
import { orderApiService } from "../../../services/adapters/orders.api";

export function useOrderQuery(id: number) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApiService.getOrder(id),
    enabled: !!id
  });
}