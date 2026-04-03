import { httpGet, httpPost } from "../../../lib/http/http-client"
import type { GateSecurityService, GateExitRequest, GateExitResponse, GateLogResponse } from "../types/gate-security.types"

export const gateSecurityApi: GateSecurityService = {
  async verifyGateExit(tokenNo: string, pin: string): Promise<GateExitResponse> {
    const request: GateExitRequest = { tokenNo, pin }
    return httpPost<GateExitResponse>("/tokens/gate-exit", request)
  },

  async getGateLogs(): Promise<GateLogResponse> {
    return httpGet<GateLogResponse>("/tokens/gate-log")
  }
}
