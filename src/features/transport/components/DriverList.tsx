import React, { useMemo } from 'react';
import { Phone, BadgeCheck, ShieldAlert, Edit2, Trash2, User, UserPlus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Driver } from '../types/transport.types';
import { DataTable } from '../../../components/ui/DataTable';

interface DriverListProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export const DriverList: React.FC<DriverListProps> = ({ 
  drivers, 
  onEdit, 
  onDelete, 
  onAdd,
  isLoading
}) => {
  const columns = useMemo<ColumnDef<Driver>[]>(() => [
    {
      accessorKey: 'fullName',
      header: 'Driver Name',
      cell: (info) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'var(--primary-bg)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--primary)', 
            fontWeight: 'bold', 
            fontSize: '12px' 
          }}>
            {(info.getValue() as string || 'U').charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{info.getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: 'licenseNumber',
      header: 'License No.',
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
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: (info) => (
        <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={14} style={{ opacity: 0.6 }} />
          {info.getValue() as string || '-'}
        </span>
      )
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => (
        <div className={`badge ${info.getValue() ? 'badge-success' : 'badge-danger'}`} style={{ gap: '6px' }}>
          {info.getValue() ? <BadgeCheck size={12} /> : <ShieldAlert size={12} />}
          {info.getValue() ? 'Active' : 'Inactive'}
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
            title="Edit Driver"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(info.row.original.id)} 
            className="btn" 
            style={{ padding: '6px', background: 'var(--danger-bg)', color: 'var(--danger)', border: 'none' }}
            title="Delete Driver"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], [onEdit, onDelete]);

  return (
    <DataTable
      title="Driver Personnel Registry"
      icon={<User size={20} />}
      columns={columns}
      data={drivers}
      isLoading={isLoading}
      searchPlaceholder="Search by name, license or phone..."
      headerActions={
        <button
          className="btn-primary"
          style={{ height: '44px', padding: '0 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          onClick={onAdd}
        >
          <UserPlus size={20} /> Add New Driver
        </button>
      }
    />
  );
};
