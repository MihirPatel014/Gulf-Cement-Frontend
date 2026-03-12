export type ProductDto = {
  id: number;
  name: string;
  sku: string;
  price: number;
  isActive: boolean;
};

export interface ProductService {
  getProducts(): Promise<ProductDto[]>;
}

