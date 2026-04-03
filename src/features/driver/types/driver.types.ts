export interface DriverTrip {
  tokenId: number
  tokenNo: string
  truck: string
  customer: string
  product: string
  destination: string
  stage: 'InTransit' | 'Arrived' | string
}

export interface DriverTripResponse {
  data: DriverTrip[]
}

export interface MarkArrivedResponse {
  success: boolean
  message?: string
  data?: any
}

export interface DriverApiService {
  getDriverTrips(): Promise<DriverTripResponse>
  markArrived(tokenId: number, userId: number): Promise<MarkArrivedResponse>
}