export interface ControlBoardItem {
  tokenId: number
  tokenNo: string
  truck: string
  driver: string
  customer: string
  product: string
  zone: string | null
  loadingPoint: string | null
  weighbridge: string | null
  stage: string
  timer: string | null
  alert: string | null
}

export interface ControlBoardResponse {
  data: ControlBoardItem[]
  totalCount: number
}

export interface GetControlBoardParams {
  pageNumber?: number
  pageSize?: number
}

export interface AssignZoneRequest {
  tokenId: number
  zoneId: number
  loadingPointId: number
  weighbridgeId: number
}

export interface AssignTokenResponse {
  success: boolean
  message: string
  data: any
  error: string | null
}

export interface Zone {
  id: number
  name: string
}

export interface LoadingPoint {
  id: number
  name: string
}

export interface Weighbridge {
  id: number
  name: string
}

export interface ControlBoardService {
  getControlBoard(params?: GetControlBoardParams): Promise<ControlBoardResponse>
  assignZone(request: AssignZoneRequest): Promise<AssignTokenResponse>
  getZones(): Promise<Zone[]>
  getLoadingPoints(zoneId?: string): Promise<LoadingPoint[]>
  getWeighbridges(zoneId?: string): Promise<Weighbridge[]>
}