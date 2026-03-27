import { httpGet, httpPut, httpPost } from "../../lib/http/http-client"
import type {
  OrderDto,
  OrderService,
  CreateOrderRequest,
  PaginatedOrdersResponse,
  GetOrdersParams,
  DispatchOrder,
  PaginatedDispatchResponse,
  GetDispatchParams,
  CreateShipmentRequest
} from "../contracts/order"

export const orderApiService: OrderService = {

  async getOrders(params?: GetOrdersParams) {

    const query = new URLSearchParams()

    if (params?.pageNumber) query.append("pageNumber", String(params.pageNumber))
    if (params?.pageSize) query.append("pageSize", String(params.pageSize))
    if (params?.search) query.append("search", params.search)
    if (params?.sortBy) query.append("sortBy", params.sortBy)
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder)
    if (params?.status) query.append("status", params.status)
    if (params?.productId) query.append("productId", String(params.productId))

    const url = `/orders/paginated-data?${query.toString()}`

    return httpGet<PaginatedOrdersResponse>(url)
  },

  async getDispatchList() {
    return httpGet<DispatchOrder[]>("/orders/dispatch-list")
  },

  async getDispatchPaginated(params?: GetDispatchParams) {
    const query = new URLSearchParams()

    if (params?.pageNumber) query.append("pageNumber", String(params.pageNumber))
    if (params?.pageSize) query.append("pageSize", String(params.pageSize))
    if (params?.search) query.append("search", params.search)
    if (params?.sortBy) query.append("sortBy", params.sortBy)
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder)
    if (params?.status !== undefined && params.status !== null) query.append("status", String(params.status))
    if (params?.productId) query.append("productId", String(params.productId))

    const url = `/orders/dispatch-list/paginated-data?${query.toString()}`

    return httpGet<PaginatedDispatchResponse>(url)
  },

  async createOrder(payload: CreateOrderRequest) {
    return httpPost<number>("/orders", payload)
  },

  async getOrder(id: number) {
    return httpGet<OrderDto>(`/orders/${id}`)
  },

  async getOrderTracking(id: number) {
    return httpGet<any>(`/orders/${id}/tracking`)
  },

  async updateOrderStatus(id: number, status: number, remarks?: string) {
    return httpPut<{ success: boolean; message: string }>(`/orders/${id}/status?status=${status}&remarks=${remarks ?? ''}`, undefined)
  },

  async createShipment(payload: CreateShipmentRequest) {
    return httpPost<number>("/shipment", payload)
  }

}