import React from 'react';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import type { WeighbridgeRecord } from '../types';

interface HistoryTabProps {
  records: WeighbridgeRecord[];
  onViewVoucher: (record: WeighbridgeRecord) => void;
}

const getStatusBadge = (status: string) => {
  const s = status.toLowerCase();

  if (s.includes('tare captured') || s.includes('zoneassigned'))
    return <span className="badge badge-warning rounded-full px-3">Tare Ready</span>;
  if (s.includes('complete') || s.includes('voucherready'))
    return <span className="badge badge-success rounded-full px-3">Complete</span>;
  if (s.includes('loading'))
    return <span className="badge badge-info rounded-full px-3">Loading</span>;
  if (s.includes('weighing'))
    return <span className="badge badge-primary rounded-full px-3">Weighing</span>;

  return <span className="badge badge-gray rounded-full px-3">{status}</span>;
};

export const HistoryTab: React.FC<HistoryTabProps> = ({ records, onViewVoucher }) => {
  const columns: ColumnDef<WeighbridgeRecord>[] = [
    { accessorKey: 'tokenId', header: 'ID', cell: info => <span className="text-secondary font-medium">#{info.getValue() as string}</span> },
    { accessorKey: 'token', header: 'TOKEN', cell: info => <span className="text-primary font-bold">{info.getValue() as string}</span> },
    { accessorKey: 'truckNo', header: 'TRUCK' },
    { accessorKey: 'productName', header: 'PRODUCT' },
    { accessorKey: 'weighbridgeName', header: 'WB' },
    { accessorKey: 'tareWeight', header: 'TARE (KG)', cell: info => `${(info.getValue() as number).toLocaleString()} kg` },
    { accessorKey: 'grossWeight', header: 'GROSS (KG)', cell: info => info.getValue() ? `${(info.getValue() as number).toLocaleString()} kg` : '-' },
    { accessorKey: 'netWeight', header: 'NET (KG)', cell: info => info.getValue() ? <span className="text-success font-bold">{(info.getValue() as number).toLocaleString()} kg</span> : '-' },
    { accessorKey: 'tareTime', header: 'TARE TIME' },
    { accessorKey: 'grossTime', header: 'GROSS TIME', cell: info => info.getValue() || '-' },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: info => getStatusBadge(info.getValue() as string)
    },
    {
      id: 'voucher',
      header: 'VOUCHER',
      cell: ({ row }) => row.original.hasVoucher ? (
        <button
          className="badge badge-success text-white flex items-center gap-1 border-none cursor-pointer"
          onClick={() => onViewVoucher(row.original)}
        >
          <FileText size={14} /> Generated
        </button>
      ) : '-'
    }
  ];

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map(h => (
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
            {table.getRowModel().rows.map(row => (
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
  );
};
