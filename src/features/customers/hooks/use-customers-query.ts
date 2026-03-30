import { useQuery } from "@tanstack/react-query";
import { customerApiService } from "../../../services/adapters/customers.api";

export function useCustomersQuery(params?: { pageSize?: number }) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerApiService.getCustomers(params?.pageSize)
  });
}