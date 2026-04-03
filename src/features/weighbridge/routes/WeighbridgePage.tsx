import React, { useState, useEffect } from 'react';
import { WeighbridgeStatsComponent } from '../components/WeighbridgeStats';
import { WeightCaptureTab } from '../components/WeightCaptureTab';
import { HistoryTab } from '../components/HistoryTab';
import { useWeighbridgeStore } from '../store/use-weighbridge-store';
import { toast } from 'sonner';

export const WeighbridgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'capture' | 'history'>('capture');
  const { 
    stats, tareQueue, grossQueue, records, 
    captureTare, captureGross, fetchQueues, fetchHistory 
  } = useWeighbridgeStore();

  useEffect(() => {
    fetchQueues();
    fetchHistory();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchQueues();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchQueues, fetchHistory]);

  const handleCaptureTare = (record: any, weight?: number) => {
    captureTare(record, weight);
  };

  const handleCaptureGross = (record: any, weight?: number) => {
    captureGross(record, weight);
  };

  const handleViewVoucher = (record: any) => {
    toast.info(`Opening voucher for ${record.token}...`, {
      description: "Generating PDF preview."
    });
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Weighbridge Module</h1>
        <p className="page-subtitle">Automatic weight capture — no manual entry allowed</p>
      </div>

      <WeighbridgeStatsComponent stats={stats} />

      <div className="tabs-container">
        <button 
          className={`tab-item ${activeTab === 'capture' ? 'active' : ''}`}
          onClick={() => setActiveTab('capture')}
        >
          Weight Capture
        </button>
        <button 
          className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          All Records
        </button>
      </div>

      <div className="tab-content mt-4">
        {activeTab === 'capture' ? (
          <WeightCaptureTab 
            tareQueue={tareQueue}
            grossQueue={grossQueue}
            onCaptureTare={handleCaptureTare}
            onCaptureGross={handleCaptureGross}
          />
        ) : (
          <HistoryTab 
            records={records}
            onViewVoucher={handleViewVoucher}
          />
        )}
      </div>
    </div>
  );
};
