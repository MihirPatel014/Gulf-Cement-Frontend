import { useQuery } from "@tanstack/react-query";
import { driverApiService } from "../../../services/adapters/drivers.api";

export function useDriversQuery() {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: () => driverApiService.getAll()
  });
}
