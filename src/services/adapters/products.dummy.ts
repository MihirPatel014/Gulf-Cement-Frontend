import type { ProductDto, ProductService } from "../contracts/product";

const dummyProducts: ProductDto[] = [
  { id: 1, name: "OPC Cement", price: 320, packaging: "50kg Bag", unit: "Bag" },
  { id: 2, name: "PPC Cement", price: 300, packaging: "50kg Bag", unit: "Bag" },
  { id: 3, name: "White Cement", price: 450, packaging: "25kg Bag", unit: "Bag" },
];

export const productDummyService: ProductService = {
  async getProducts() {
    return Promise.resolve(dummyProducts);
  },
};

