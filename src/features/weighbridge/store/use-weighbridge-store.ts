import { create } from 'zustand';
import type { WeighbridgeRecord, WeighbridgeStats } from '../types';
import { weighbridgeApi } from '../api/weighbridge.api';
import { toast } from 'sonner';

interface WeighbridgeState {
  records: WeighbridgeRecord[];
  stats: WeighbridgeStats;
  tareQueue: WeighbridgeRecord[];
  grossQueue: WeighbridgeRecord[];
  isLoading: boolean;
  
  // ACTIONS
  fetchQueues: () => Promise<void>;
  fetchHistory: (page?: number, pageSize?: number) => Promise<void>;
  captureTare: (record: WeighbridgeRecord, weight?: number) => Promise<void>;
  captureGross: (record: WeighbridgeRecord, weight?: number) => Promise<void>;
  setRecords: (records: WeighbridgeRecord[]) => void;
}

// OrderStatus enum (aligned with backend)
const OrderStatus = {
  ZoneAssigned: 7,
  Loading: 8,
  Weighing: 9,
  VoucherReady: 10
};

export const useWeighbridgeStore = create<WeighbridgeState>((set, get) => ({
  records: [],
  tareQueue: [],
  grossQueue: [],
  isLoading: false,
  stats: {
    awaitingTare: 0,
    inLoading: 0,
    completedToday: 0,
    avgNetWeight: 0
  },

  setRecords: (records) => set({ records }),

  fetchQueues: async () => {
    set({ isLoading: true });
    try {
      // OrderStatus.ZoneAssigned = 7 (Waiting for Tare)
      const tareQueue = await weighbridgeApi.getQueue(OrderStatus.ZoneAssigned);
      
      // OrderStatus.Loading = 8 (Waiting for Gross / In Loading)
      const grossQueue = await weighbridgeApi.getQueue(OrderStatus.Loading);
      
      set({ 
        tareQueue, 
        grossQueue,
        stats: {
          ...get().stats,
          awaitingTare: tareQueue.length,
          inLoading: grossQueue.length
        }
      });
    } catch (error) {
      toast.error("Failed to fetch weighbridge queues");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistory: async (page = 1, pageSize = 10) => {
    try {
      const { data } = await weighbridgeApi.getHistory(page, pageSize);
      set({ records: data });
    } catch (error) {
      toast.error("Failed to fetch history");
    }
  },

  captureTare: async (record, weight) => {
    try {
      // Use provided weight or simulate capture
      const finalWeight = weight ?? (12500 + Math.floor(Math.random() * 1000)); 
      
      const response = await weighbridgeApi.captureTare({
        tokenId: record.tokenId,
        weight: finalWeight
      });

      if (response.success) {
        toast.success(response.message);
        get().fetchQueues();
        get().fetchHistory();
      }
    } catch (error) {
      toast.error("Failed to capture tare weight");
    }
  },

  captureGross: async (record, weight) => {
    try {
      // Use provided weight or simulate capture
      const finalWeight = weight ?? (38000 + Math.floor(Math.random() * 2000)); 
      
      const response = await weighbridgeApi.captureGross({
        tokenId: record.tokenId,
        weight: finalWeight
      });

      if (response.success) {
        toast.success(response.message);
        get().fetchQueues();
        get().fetchHistory();
      }
    } catch (error) {
      toast.error("Failed to capture gross weight");
    }
  }
}));
