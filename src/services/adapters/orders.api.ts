import { httpGet, httpPost } from "../../lib/http/http-client"
import type {
  OrderDto,
  OrderService,
  CreateOrderRequest,
  PaginatedOrdersResponse,
  GetOrdersParams
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

  async createOrder(payload: CreateOrderRequest) {
    return httpPost<number>("/orders", payload)
  },

  async getOrder(id: number) {
    return httpGet<OrderDto>(`/orders/${id}`)
  },

  async getOrderTracking(id: number) {
    return httpGet<any>(`/orders/${id}/tracking`)
  }

}