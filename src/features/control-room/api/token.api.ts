import { httpGet, httpPost } from "../../../lib/http/http-client"
import type { TokenService, TokenResponse, PaginatedShipmentsResponse, GetShipmentsForTokenParams } from "../types/token.types"

export const tokenApi: TokenService = {
  async getShipmentsForToken(params?: GetShipmentsForTokenParams) {
    const query = new URLSearchParams()

    if (params?.pageNumber) query.append("pageNumber", String(params.pageNumber))
    if (params?.pageSize) query.append("pageSize", String(params.pageSize))
    if (params?.sortBy) query.append("sortBy", params.sortBy)
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder)

    const url = `/tokens/paginated-ready?${query.toString()}`
    return httpGet<PaginatedShipmentsResponse>(url)
  },

  async createToken(shipmentId: number): Promise<TokenResponse> {
    return httpPost<TokenResponse>(`/tokens/${shipmentId}`, {})
  }
}