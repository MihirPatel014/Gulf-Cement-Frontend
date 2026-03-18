import { httpGet } from "../../lib/http/http-client";
import type { ProductDto, ProductService } from "../contracts/product";

export const productApiService: ProductService = {
  async getProducts() {
    const response = await httpGet<{ data: ProductDto[] }>("/product");
    return response.data;
  },
};