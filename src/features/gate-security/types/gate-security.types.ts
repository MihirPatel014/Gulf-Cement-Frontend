export interface GateExitRequest {
  tokenNo: string
  pin: string
}

export interface GateExitResponse {
  success: boolean
  message: string
  data?: {
    tokenId: number
    tokenNo: string
    gateId: string
    verifiedAt: string
  }
  error: string | null
}

export interface GateLog {
  gateId: string
  tokenNo: string
  status: 'Not Ready' | 'Locked' | 'Passed' | 'Failed'
  verifiedAt: string | null
  reason: string
}

export interface GateLogResponse {
  data: GateLog[]
}

// Alternative response type for when API returns array directly
export type GateLogList = GateLog[]

export interface GateSecurityService {
  verifyGateExit(tokenNo: string, pin: string): Promise<GateExitResponse>
  getGateLogs(): Promise<GateLogResponse>
}
