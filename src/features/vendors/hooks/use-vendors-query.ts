import { useQuery } from "@tanstack/react-query";
import { vendorApiService } from "../../../services/adapters/vendors.api";

export function useVendorsQuery() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: vendorApiService.getVendors
  });
}
