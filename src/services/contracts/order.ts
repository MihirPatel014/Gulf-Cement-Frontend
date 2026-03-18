export type OrderDto = {
  id: number
  orderNo: string
  orderDate: string
  totalAmount: number
  status: string
  transportType: string
  deliveryAddress: string
  preferredDeliveryDate: string
  remarks: string
  customerName?: string 
  items: {
    productId: number
    productName: string
    packaging: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }[]
};

export type PaginatedOrdersResponse = {
  data: OrderDto[];
  totalCount: number;
};

export type CreateOrderRequest = {
  items: {
    productId: number
    quantity: number
    packaging?: string
  }[]

  transportType: string

  deliveryAddress: string

  preferredDeliveryDate: string

  remarks?: string

  vehicleNumber?: string
  driverName?: string
  driverMobile?: string
  vehicleArrivalTime?: string
  estimatedArrivalAtPlant?: string
}
export interface GetOrdersParams {
  pageNumber?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  status?: string
  productId?: number
}
export interface OrderService {
  getOrders(params?: GetOrdersParams): Promise<PaginatedOrdersResponse>
  createOrder(payload: CreateOrderRequest): Promise<number>;
  getOrder(id: number): Promise<OrderDto>;
  getOrderTracking(id: number): Promise<any>;
}