import { env } from "../lib/config/env";
import { productApiService } from "./adapters/products.api";
import { productDummyService } from "./adapters/products.dummy";
import type { ProductService } from "./contracts/product";

export type Services = {
  products: ProductService;
};

export function createServices(): Services {
  return {
    products: env.dataSource === "api" ? productApiService : productDummyService,
  };
}

