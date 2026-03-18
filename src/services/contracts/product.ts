export type ProductDto = {
  id: number;
  name: string;
  price: number;
  packaging:string;
  unit:string;
};

export interface ProductService {
  getProducts(): Promise<ProductDto[]>;
}

