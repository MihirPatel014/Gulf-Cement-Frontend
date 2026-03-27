import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { services } from "../../../app/services";
import { toast } from "sonner";
import type { ProductDto } from "../../../services/contracts/product";

export function useProductsQuery(filters: {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      return await services.products.getProducts(filters);
    },
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<ProductDto, 'id'>) => services.products.createProduct(product),
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create product");
    }
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: ProductDto) => services.products.updateProduct(product),
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    }
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => services.products.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete product");
    }
  });
}