import { httpGet, httpPost, httpPut, httpDelete } from '../../lib/http/http-client';
import type { Sequence, SequenceCreate, SequenceUpdate, SequenceService } from '../contracts/sequence';

export const sequenceApiService: SequenceService = {
  async getAll(): Promise<Sequence[]> {
    return httpGet<Sequence[]>('/sequence');
  },

  async getById(id: number): Promise<Sequence> {
    return httpGet<Sequence>(`/sequence/${id}`);
  },

  async create(data: SequenceCreate) {
    return httpPost<{ success: boolean; message: string }>('/sequence', data);
  },

  async update(data: SequenceUpdate) {
    return httpPut<{ success: boolean; message: string }>('/sequence', data);
  },

  async delete(id: number) {
    await httpDelete(`/sequence/${id}`);
    return { success: true, message: "Sequence deleted successfully" };
  },
  
  async getPreviewNext(key: string): Promise<{ nextNumber: string }> {
    return httpGet<{ nextNumber: string }>(`/sequence/preview-next/${key}`);
  },
};
