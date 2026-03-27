import React, { useMemo } from 'react';
import { Scale, Info, Truck, Edit2, Trash2, Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Vehicle } from '../types/transport.types';
import { DataTable } from '../../../components/ui/DataTable';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onEdit,
  onDelete,
  onAdd,
  isLoading
}) => {
  const columns = useMemo<ColumnDef<Vehicle>[]>(() => [
    {
      accessorKey: 'plateNumber',
      header: 'Plate Number',
      cell: (info) => (
        <code style={{
          background: 'var(--bg)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)'
        }}>
          {info.getValue() as string}
        </code>
      )
    },
    {
      accessorKey: 'vehicleType',
      header: 'Type',
      cell: (info) => (
        <span className={`badge ${(info.getValue() as string) === 'BULK' ? 'badge-staff' : 'badge-role'}`}>
          {info.getValue() as string}
        </span>
      )
    },
    {
      accessorKey: 'maxCapacity',
      header: 'Capacity',
      cell: (info) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13.5px' }}>
          <Scale size={14} style={{ opacity: 0.6 }} /> {info.getValue() as number} Tons
        </span>
      )
    },
    {
      accessorKey: 'model',
      header: 'Model',
      cell: (info) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          <Info size={12} style={{ opacity: 0.6 }} /> {(info.getValue() as string) || '-'}
        </span>
      )
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => (
        <div className={`badge ${info.getValue() ? 'badge-success' : 'badge-danger'}`} style={{ gap: '6px' }}>
          {info.getValue() ? '● Ready' : '○ In Shop / Out'}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onEdit(info.row.original)}
            className="btn"
            style={{ padding: '6px', background: 'var(--info-bg)', color: 'var(--info)', border: 'none' }}
            title="Edit Vehicle"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(info.row.original.id)}
            className="btn"
            style={{ padding: '6px', background: 'var(--danger-bg)', color: 'var(--danger)', border: 'none' }}
            title="Delete Vehicle"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], [onEdit, onDelete]);

  return (
    <DataTable
      title="Fleet Vehicle Registry"
      subtitle="Manage logistics vehicles and load capacities"
      icon={<Truck size={20} />}
      columns={columns}
      data={vehicles}
      isLoading={isLoading}
      searchPlaceholder="Search by plate, type or model..."
      headerActions={
        <button
          className="btn-primary"
          style={{ height: '44px', padding: '0 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          onClick={onAdd}
        >
          <Plus size={20} /> Add New Vehicle
        </button>
      }
    />
  );
};
