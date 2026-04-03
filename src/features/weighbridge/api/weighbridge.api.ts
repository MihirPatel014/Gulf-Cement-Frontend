import { httpGet, httpPost } from "../../../lib/http/http-client";
import type { WeighbridgeRecord, WeightCaptureRequest } from "../types";

export const weighbridgeApi = {
  async getQueue(stage: number): Promise<WeighbridgeRecord[]> {
    const response = await httpGet<any[]>(`/tokens/weighbridge-queue/${stage}`);
    return response.map(this.mapToRecord);
  },

  async captureTare(request: WeightCaptureRequest): Promise<{ success: boolean; message: string }> {
    return httpPost("/tokens/capture-tare", request);
  },

  async captureGross(request: WeightCaptureRequest): Promise<{ success: boolean; message: string }> {
    return httpPost("/tokens/capture-gross", request);
  },

  async getHistory(pageNumber = 1, pageSize = 10): Promise<{ data: WeighbridgeRecord[], totalCount: number }> {
    const response = await httpGet<any>(`/tokens/control-board?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return {
      data: response.data.map(this.mapToRecord),
      totalCount: response.totalCount
    };
  },

  mapToRecord(item: any): WeighbridgeRecord {
    return {
      tokenId: item.tokenId,
      token: item.tokenNo,
      truckNo: item.truck,
      driverName: item.driver,
      productName: item.product,
      customerName: item.customer,
      zone: item.zone,
      weighbridgeName: item.weighbridge || "-",
      tareWeight: item.tareWeight,
      grossWeight: item.grossWeight,
      netWeight: item.netWeight,
      status: item.stage,
      hasVoucher: item.stage === "VoucherReady" || item.stage === "10"
    };
  }
};
