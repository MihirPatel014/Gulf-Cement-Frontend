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
  vehicleNumber?: string
  driverName?: string
  driverMobile?: string
  items: {
    id: number
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

export interface DispatchOrder {
  orderId: number
  orderNo: string
  customerName: string
  productName: string
  quantity: number
  amount: number
  transportType: string
  orderDate: string
  status: number
  approvedAt?: string | null
  approvedBy?: string | null
  items?: {
    orderItemId: number
    productId: number
    productName: string
    quantity: number
    amount: number
  }[]
  totalQuantity?: number
  totalAmount?: number
}

export interface PaginatedDispatchResponse {
  data: DispatchOrder[]
  totalCount: number
}

export interface GetDispatchParams {
  pageNumber?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: string
  status?: number
  productId?: number
}

export interface OrderService {
  getOrders(params?: GetOrdersParams): Promise<PaginatedOrdersResponse>
  getDispatchList(): Promise<DispatchOrder[]>
  getDispatchPaginated(params?: GetDispatchParams): Promise<PaginatedDispatchResponse>
  createOrder(payload: CreateOrderRequest): Promise<number>;
  getOrder(id: number): Promise<OrderDto>;
  getOrderTracking(id: number): Promise<any>;
  updateOrderStatus(id: number, status: number, remarks?: string): Promise<{ success: boolean; message: string }>;
  createShipment(payload: CreateShipmentRequest): Promise<number>;
}

export type CreateShipmentRequest = {
  orderId: number
  transportType: string
  vehicleId?: number
  driverId?: number
  extVehicleNumber?: string
  extDriverName?: string
  extDriverMobile?: string
  items: {
    orderItemId: number
    quantity: number
  }[]
}