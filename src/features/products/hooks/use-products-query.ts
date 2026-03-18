import { useQuery } from "@tanstack/react-query";
import { services } from "../../../app/services";

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await services.products.getProducts();
    },
  });
}