export interface Sequence {
  id: number;
  sequenceKey: string;
  prefix?: string;
  suffix?: string;
  currentValue: number;
  paddingLength: number;
  description?: string;
  updatedAt: string;
}

export interface SequenceCreate {
  sequenceKey: string;
  prefix?: string;
  suffix?: string;
  currentValue: number;
  paddingLength: number;
  description?: string;
}

export interface SequenceUpdate extends SequenceCreate {
  id: number;
}

export interface SequenceService {
  getAll(): Promise<Sequence[]>;
  getById(id: number): Promise<Sequence>;
  create(data: SequenceCreate): Promise<{ success: boolean; message: string }>;
  update(data: SequenceUpdate): Promise<{ success: boolean; message: string }>;
  delete(id: number): Promise<{ success: boolean; message: string }>;
  getPreviewNext(key: string): Promise<{ nextNumber: string }>;
}
