import type { ProductDto, ProductService } from "../contracts/product";

const dummyProducts: ProductDto[] = [
  { id: 1, name: "OPC Cement", code: "OPC-001", description: "Ordinary Portland Cement", price: 320, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 2, name: "PPC Cement", code: "PPC-001", description: "Portland Pozzolana Cement", price: 300, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 3, name: "White Cement", code: "WC-001", description: "White Portland Cement", price: 450, packaging: "25kg Bag", unit: "Bag", isActive: true },
  { id: 4, name: "PSC Cement", code: "PSC-001", description: "Portland Slag Cement", price: 340, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 5, name: "Rapid Hardening Cement", code: "RHC-001", description: "Rapid Hardening Cement", price: 380, packaging: "50kg Bag", unit: "Bag", isActive: false },
  { id: 6, name: "Sulphate Resisting Cement", code: "SRC-001", description: "Sulphate Resisting Cement", price: 360, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 7, name: "Low Heat Cement", code: "LHC-001", description: "Low Heat Cement", price: 350, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 8, name: "Oil Well Cement", code: "OWC-001", description: "Oil Well Cement Grade G", price: 420, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 9, name: "Colored Cement", code: "CC-001", description: "Colored Portland Cement", price: 500, packaging: "25kg Bag", unit: "Bag", isActive: true },
  { id: 10, name: "Hydrophobic Cement", code: "HC-001", description: "Hydrophobic Cement", price: 390, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 11, name: "Masonry Cement", code: "MC-001", description: "Masonry Cement", price: 280, packaging: "50kg Bag", unit: "Bag", isActive: true },
  { id: 12, name: "Expansive Cement", code: "EC-001", description: "Expansive Cement", price: 480, packaging: "25kg Bag", unit: "Bag", isActive: false },
];

export const productDummyService: ProductService = {
  async getProducts(filters) {
    let filtered = [...dummyProducts];
    
    // Apply search filter
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.code.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    const sortBy = filters?.sortBy || "id";
    const sortOrder = filters?.sortOrder || "asc";
    
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof ProductDto];
      const bVal = b[sortBy as keyof ProductDto];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    
    // Apply pagination
    const pageNumber = filters?.pageNumber || 1;
    const pageSize = filters?.pageSize || 10;
    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);
    
    return {
      totalCount: filtered.length,
      data: paginatedData
    };
  },

  async createProduct(product: Omit<ProductDto, 'id'>): Promise<number> {
    const newId = Math.max(...dummyProducts.map(p => p.id)) + 1;
    const newProduct: ProductDto = { ...product, id: newId };
    dummyProducts.push(newProduct);
    return newId;
  },

  async updateProduct(product: ProductDto): Promise<void> {
    const index = dummyProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      dummyProducts[index] = product;
    }
  },

  async deleteProduct(id: number): Promise<void> {
    const index = dummyProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      dummyProducts.splice(index, 1);
    }
  },
};
