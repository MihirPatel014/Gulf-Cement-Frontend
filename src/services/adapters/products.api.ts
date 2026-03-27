import { httpGet, httpPost, httpPut, httpDelete } from "../../lib/http/http-client";
import type { ProductDto, ProductService } from "../contracts/product";

export const productApiService: ProductService = {
  async getProducts(filters) {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.pageNumber) params.set("pageNumber", filters.pageNumber.toString());
      if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
      if (filters.search) params.set("search", filters.search);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/product/paginated-data?${queryString}` : "/product/paginated-data";
    
    const response = await httpGet<{ 
      success: boolean; 
      data: { 
        totalCount: number; 
        data: ProductDto[] 
      } 
    }>(url);
    
    return {
      totalCount: response.data.totalCount,
      data: response.data.data
    };
  },
  async createProduct(product: Omit<ProductDto, 'id'>): Promise<number> {
    const response = await httpPost<{ success: boolean; data: number }>("/product", product);
    return response.data;
  },
  async updateProduct(product: ProductDto): Promise<void> {
    await httpPut(`/product/${product.id}`, product);
  },
  async deleteProduct(id: number): Promise<void> {
    await httpDelete(`/product/${id}`);
  }
};