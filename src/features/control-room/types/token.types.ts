export interface TokenResponse {
  success: boolean
  message: string
  data: {
    tokenId: number
    tokenNo: string
    gatePin: string
  }
  error: string | null
}

export interface ShipmentForToken {
  orderId: number
  orderNo: string
  customerName: string
  productName: string
  quantity: number
  transportType: string
  shipmentId: number
}

export interface GetShipmentsForTokenParams {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}

export interface PaginatedShipmentsResponse {
  data: ShipmentForToken[]
  totalCount: number
}

export interface TokenService {
  getShipmentsForToken(params?: GetShipmentsForTokenParams): Promise<PaginatedShipmentsResponse>
  createToken(shipmentId: number): Promise<TokenResponse>
}