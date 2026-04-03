import { httpGet, httpPost } from "../../../lib/http/http-client"
import type { DriverApiService, DriverTripResponse, MarkArrivedResponse } from "../types/driver.types"

export const driverApi: DriverApiService = {
  async getDriverTrips(): Promise<DriverTripResponse> {
    return httpGet<DriverTripResponse>("/tokens/driver-list")
  },

  async markArrived(tokenId: number, userId: number): Promise<MarkArrivedResponse> {
    return httpPost<MarkArrivedResponse>(`/tokens/arrived/${tokenId}`, { userId })
  }
}