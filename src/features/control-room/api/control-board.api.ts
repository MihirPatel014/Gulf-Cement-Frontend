import { httpGet, httpPost } from "../../../lib/http/http-client"
import type { 
  ControlBoardService, 
  ControlBoardResponse, 
  GetControlBoardParams, 
  AssignZoneRequest,
  AssignTokenResponse,
  Zone,
  LoadingPoint,
  Weighbridge 
} from "../types/control-board.types"

export const controlBoardApi: ControlBoardService = {
  async getControlBoard(params?: GetControlBoardParams) {
    const query = new URLSearchParams()

    if (params?.pageNumber) query.append("pageNumber", String(params.pageNumber))
    if (params?.pageSize) query.append("pageSize", String(params.pageSize))

    const url = `/tokens/control-board?${query.toString()}`
    return httpGet<ControlBoardResponse>(url)
  },

  async assignZone(request: AssignZoneRequest): Promise<AssignTokenResponse> {
    return httpPost<AssignTokenResponse>("/tokens/assign", request)
  },

  async getZones(): Promise<Zone[]> {
    const response = await httpGet<Zone[]>("/common/zones")
    return response
  },

  async getLoadingPoints(zoneId?: string): Promise<LoadingPoint[]> {
    if (!zoneId) {
      return []
    }
    const url = `/common/loading-points?zoneId=${zoneId}`
    return httpGet<LoadingPoint[]>(url)
  },

  async getWeighbridges(zoneId?: string): Promise<Weighbridge[]> {
    if (!zoneId) {
      return []
    }
    const url = `/common/weighbridges?zoneId=${zoneId}`
    return httpGet<Weighbridge[]>(url)
  }
}