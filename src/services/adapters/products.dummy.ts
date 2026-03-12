import type { ProductDto, ProductService } from "../contracts/product";

const dummyProducts: ProductDto[] = [
  { id: 1, name: "OPC Cement", sku: "CEM-OPC-001", price: 320, isActive: true },
  { id: 2, name: "PPC Cement", sku: "CEM-PPC-002", price: 300, isActive: true },
  { id: 3, name: "White Cement", sku: "CEM-WHT-003", price: 450, isActive: false },
];

export const productDummyService: ProductService = {
  async getProducts() {
    return Promise.resolve(dummyProducts);
  },
};

