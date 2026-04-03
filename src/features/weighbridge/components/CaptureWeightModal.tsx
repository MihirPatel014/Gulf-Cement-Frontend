import React, { useState } from 'react';
import { Scale, X, Truck, Info } from 'lucide-react';
import type { WeighbridgeRecord } from '../types';

interface CaptureWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (weight: number) => void;
  record: WeighbridgeRecord | null;
  type: 'Tare' | 'Gross';
}

export const CaptureWeightModal: React.FC<CaptureWeightModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  record, 
  type 
}) => {
  const [weight, setWeight] = useState<string>('');

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericWeight = parseFloat(weight);
    if (!isNaN(numericWeight) && numericWeight > 0) {
      onConfirm(numericWeight);
      setWeight('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col" style={{ position: 'relative', zIndex: 10000 }}>
        
        {/* HEADER */}
        <div className={`p-5 flex items-center justify-between ${type === 'Tare' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shadow-sm ${type === 'Tare' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <Scale size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Manual {type} Capture</h3>
              <p className="text-sm font-medium text-gray-600">Token: <span className="text-primary">{record.token}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* VEHICLE INFO CARD */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 space-y-3">
            <div className="flex items-start gap-3">
              <Truck size={18} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Truck & Product</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-gray-800">{record.truckNo}</span>
                  <span className="text-sm text-gray-500">— {record.productName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* INPUT FIELD */}
          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <label className="text-sm font-bold text-gray-700">Enter Weighing Value</label>
              <span className="text-xs text-primary font-bold">KG (Kilograms)</span>
            </div>
            <div className="relative">
              <input 
                type="number"
                autoFocus
                className="w-full text-3xl font-black py-4 px-4 text-center rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all outline-none text-gray-900 bg-gray-50/30"
                placeholder="0.000"
                step="0.001"
                min="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                 <Scale size={24} />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50/50 p-2 rounded-lg">
              <Info size={14} />
              <p className="text-xs font-medium italic">
                Please verify weight against the physical bridge reader.
              </p>
            </div>
          </div>

          {/* NET WEIGHT HINT FOR GROSS */}
          {type === 'Gross' && record.tareWeight && (
            <div className="flex flex-col gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
               <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium font-bold">Tare Registered:</span>
                <span className="font-bold text-blue-900">{record.tareWeight.toLocaleString(undefined, { minimumFractionDigits: 3 })} kg</span>
              </div>
              {weight && !isNaN(parseFloat(weight)) && (
                <div className="flex justify-between text-sm border-t border-blue-100 pt-2 mt-1">
                  <span className="text-emerald-600 font-bold">Estimated Net:</span>
                  <span className="font-black text-emerald-800">
                    {(parseFloat(weight) - (record.tareWeight || 0)).toLocaleString(undefined, { minimumFractionDigits: 3 })} kg
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="py-3 px-4 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border-none cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!weight || parseFloat(weight) <= 0}
              className={`py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all border-none cursor-pointer transform active:scale-95 disabled:opacity-50 disabled:scale-100 ${
                type === 'Tare' 
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              Confirm {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
