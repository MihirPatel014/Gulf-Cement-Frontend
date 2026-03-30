import { useQuery } from "@tanstack/react-query";
import { vehicleApiService } from "../../../services/adapters/vehicles.api";

export function useVehiclesQuery() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApiService.getAll()
  });
}
