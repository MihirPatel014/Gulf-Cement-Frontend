import { env } from "../lib/config/env";
import { productApiService } from "./adapters/products.api";
import { productDummyService } from "./adapters/products.dummy";
import { sequenceApiService } from "./adapters/sequences.api";
import type { ProductService } from "./contracts/product";
import type { SequenceService } from "./contracts/sequence";

export type Services = {
  products: ProductService;
  sequences: SequenceService;
};

export function createServices(): Services {
  return {
    products: env.dataSource === "api" ? productApiService : productDummyService,
    sequences: sequenceApiService,
  };
}

