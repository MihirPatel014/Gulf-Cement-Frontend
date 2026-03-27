export type ProductDto = {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  quantity?: number;
  packaging: string;
  unit?: string;
  unitId?: number;
  unitName?: string;
  unitCode?: string;
  isActive: boolean;
};

export type ProductService = {
  getProducts(filters?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    totalCount: number;
    data: ProductDto[];
  }>;
  createProduct(product: Omit<ProductDto, 'id'>): Promise<number>;
  updateProduct(product: ProductDto): Promise<void>;
  deleteProduct(id: number): Promise<void>;
};
