import React, { useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Zap, Truck, Scale, Edit3 } from 'lucide-react';
import type { WeighbridgeRecord } from '../types';
import { CaptureWeightModal } from './CaptureWeightModal';

interface WeightCaptureProps {
  tareQueue: WeighbridgeRecord[];
  grossQueue: WeighbridgeRecord[];
  onCaptureTare: (record: WeighbridgeRecord, weight?: number) => void;
  onCaptureGross: (record: WeighbridgeRecord, weight?: number) => void;
}

export const WeightCaptureTab: React.FC<WeightCaptureProps> = ({
  tareQueue,
  grossQueue,
  onCaptureTare,
  onCaptureGross
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'Tare' | 'Gross';
    record: WeighbridgeRecord | null;
  }>({
    isOpen: false,
    type: 'Tare',
    record: null
  });

  const handleManualEntry = (record: WeighbridgeRecord, type: 'Tare' | 'Gross') => {
    setModalState({
      isOpen: true,
      type,
      record
    });
  };

  const handleConfirmWeight = (weight: number) => {
    if (modalState.type === 'Tare' && modalState.record) {
      onCaptureTare(modalState.record, weight);
    } else if (modalState.type === 'Gross' && modalState.record) {
      onCaptureGross(modalState.record, weight);
    }
  };

  const tareColumns: ColumnDef<WeighbridgeRecord>[] = [
    { accessorKey: 'token', header: 'TOKEN', cell: info => <span className="text-primary font-bold">{info.getValue() as string}</span> },
    { accessorKey: 'truckNo', header: 'TRUCK' },
    { accessorKey: 'driverName', header: 'DRIVER', cell: info => info.getValue() || '-' },
    { accessorKey: 'productName', header: 'PRODUCT' },
    {
      accessorKey: 'zone',
      header: 'ZONE',
      cell: info => <span className="badge badge-info rounded-full px-3">{info.getValue() as string}</span>
    },
    { accessorKey: 'weighbridgeName', header: 'WB' },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="badge bg-primary text-white flex items-center gap-2 py-2 px-4 rounded-full border-none cursor-pointer"
            onClick={() => onCaptureTare(row.original)}
            title="Automatically capture weight from scale"
          >
            <Zap size={14} /> Auto
          </button>
          <button 
            className="flex items-center gap-2 py-2 px-4 rounded-full border-none cursor-pointer text-white font-bold"
            style={{ backgroundColor: '#f59e0b' }}
            onClick={() => handleManualEntry(row.original, 'Tare')}
            title="Manually enter weight"
          >
            <Edit3 size={14} /> Manual
          </button>
        </div>
      )
    }
  ];

  const grossColumns: ColumnDef<WeighbridgeRecord>[] = [
    { accessorKey: 'token', header: 'TOKEN', cell: info => <span className="text-primary font-bold">{info.getValue() as string}</span> },
    { accessorKey: 'truckNo', header: 'TRUCK' },
    { accessorKey: 'tareWeight', header: 'TARE (KG)', cell: info => `${(info.getValue() as number).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg` },
    { accessorKey: 'tareTime', header: 'TARE TIME' },
    { accessorKey: 'weighbridgeName', header: 'WB' },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            className="badge badge-success text-white flex items-center gap-2 py-2 px-4 rounded-full border-none cursor-pointer font-bold"
            onClick={() => onCaptureGross(row.original)}
            title="Automatically capture weight from scale"
          >
            <Zap size={14} /> Auto
          </button>
          <button 
            className="flex items-center gap-2 py-2 px-4 rounded-full border-none cursor-pointer text-white font-bold"
            style={{ backgroundColor: '#f59e0b' }}
            onClick={() => handleManualEntry(row.original, 'Gross')}
            title="Manually enter weight"
          >
            <Edit3 size={14} /> Manual
          </button>
        </div>
      )
    }
  ];

  const tareTable = useReactTable({
    data: tareQueue,
    columns: tareColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const grossTable = useReactTable({
    data: grossQueue,
    columns: grossColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-8">
      {/* TARE CAPTURE SECTION */}
      <div className="card shadow-sm border-0">
        <div className="card-header border-none pb-0 pt-6 px-6">
          <div className="flex items-center gap-2">
            <Scale size={22} className="text-warning" />
            <h3 className="card-title text-xl font-bold">Tare Capture — Trucks Awaiting Tare</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="table-container bg-white rounded-xl">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  {tareTable.getHeaderGroups().map(h => (
                    <tr key={h.id}>
                      {h.headers.map(header => (
                        <th key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {tareTable.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* GROSS CAPTURE SECTION */}
      <div className="mt-8 card shadow-sm border-0">
        <div className="card-header border-none pb-0 pt-6 px-6">
          <div className="flex items-center gap-2">
            <Truck size={22} className="text-success" />
            <h3 className="card-title text-xl font-bold">Gross Capture — Loaded Trucks</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="table-container bg-white rounded-xl">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  {grossTable.getHeaderGroups().map(h => (
                    <tr key={h.id}>
                      {h.headers.map(header => (
                        <th key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {grossTable.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CaptureWeightModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmWeight}
        record={modalState.record}
        type={modalState.type}
      />
    </div>
  );
};
