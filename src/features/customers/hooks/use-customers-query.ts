import { useQuery } from "@tanstack/react-query";
import { customerApiService } from "../../../services/adapters/customers.api";

export function useCustomersQuery() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: customerApiService.getCustomers
  });
}