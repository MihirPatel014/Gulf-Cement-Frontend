import { httpGet } from "../../lib/http/http-client";
import type { ProductDto, ProductService } from "../contracts/product";

export const productApiService: ProductService = {
  async getProducts() {
    return httpGet<ProductDto[]>("/products");
  },
};

