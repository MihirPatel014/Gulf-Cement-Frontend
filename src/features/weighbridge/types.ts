export type WeighbridgeStatus = "Pending" | "Tare Captured" | "Loading" | "Gross Captured" | "Complete";

export interface WeighbridgeRecord {
  tokenId: number;
  token: string;
  truckNo: string;
  driverName?: string;
  productName: string;
  customerName?: string;
  zone?: string;
  weighbridgeName: string;
  tareWeight?: number;
  grossWeight?: number;
  netWeight?: number;
  tareTime?: string;
  grossTime?: string;
  status: WeighbridgeStatus | string;
  hasVoucher?: boolean;
}

export interface WeightCaptureRequest {
  tokenId: number;
  weight: number;
}

export interface WeighbridgeStats {
  awaitingTare: number;
  inLoading: number;
  completedToday: number;
  avgNetWeight: number;
}
