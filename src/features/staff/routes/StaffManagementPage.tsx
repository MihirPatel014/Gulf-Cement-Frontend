import React, { useState, useEffect, useMemo } from 'react';
import {
  createColumnHelper
} from '@tanstack/react-table';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { staffApi } from '../api/staff.api';
import { Staff } from '../types/staff.types';
import { DataTable } from '../../../components/ui/DataTable';
import { StaffForm } from '../components/StaffForm';

const columnHelper = createColumnHelper<Staff>();

export const StaffManagementPage: React.FC = () => {
  const [data, setData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    userId: 0,
    employeeCode: '',
    department: '',
    positionTitle: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    isActive: true
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await staffApi.getAll();
      if (res.success) setData(res.data);
    } catch (error) {
      toast.error('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staff: Staff) => {
    if (!window.confirm(`Are you sure you want to delete staff member ${staff.employeeCode || staff.id}?`)) return;
    try {
      await staffApi.delete(staff.id);
      toast.success('Staff deleted successfully');
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        userId: staff.userId,
        employeeCode: staff.employeeCode || '',
        department: staff.department || '',
        positionTitle: staff.positionTitle || '',
        addressLine1: staff.addressLine1 || '',
        addressLine2: staff.addressLine2 || '',
        city: staff.city || '',
        stateProvince: staff.stateProvince || '',
        postalCode: staff.postalCode || '',
        country: staff.country || '',
        isActive: staff.isActive
      });
    } else {
      setEditingStaff(null);
      setFormData({
        userId: 0,
        employeeCode: '',
        department: '',
        positionTitle: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        stateProvince: '',
        postalCode: '',
        country: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingStaff) {
        await staffApi.update({
          id: editingStaff.id,
          userId: formData.userId,
          employeeCode: formData.employeeCode,
          department: formData.department,
          positionTitle: formData.positionTitle,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          postalCode: formData.postalCode,
          country: formData.country,
          isActive: formData.isActive
        });
        toast.success('Staff updated');
      } else {
        await staffApi.create({
          userId: formData.userId,
          employeeCode: formData.employeeCode,
          department: formData.department,
          positionTitle: formData.positionTitle,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          postalCode: formData.postalCode,
          country: formData.country,
          isActive: formData.isActive
        });
        toast.success('Staff created');
      }
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor('employeeCode', {
      header: 'Employee Code',
      cell: info => <span>{info.getValue() || '-'}</span>
    }),
    columnHelper.accessor('department', {
      header: 'Department',
      cell: info => <span>{info.getValue() || '-'}</span>
    }),
    columnHelper.accessor('positionTitle', {
      header: 'Position Title',
      cell: info => <span>{info.getValue() || '-'}</span>
    }),
    columnHelper.accessor('addressLine1', {
      header: 'Address Line 1',
      cell: info => <span>{info.getValue()}</span>
    }),
    columnHelper.accessor('city', {
      header: 'City',
      cell: info => <span>{info.getValue()}</span>
    }),
    columnHelper.accessor('stateProvince', {
      header: 'State/Province',
      cell: info => <span>{info.getValue()}</span>
    }),
    columnHelper.accessor('postalCode', {
      header: 'Postal Code',
      cell: info => <span>{info.getValue()}</span>
    }),
    columnHelper.accessor('country', {
      header: 'Country',
      cell: info => <span>{info.getValue()}</span>
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: info => (
        <span className={`badge ${info.getValue() ? 'badge-success' : 'badge-danger'}`}>
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); handleOpenModal(info.row.original); }} className="btn" style={{ padding: '6px', color: 'var(--info)', background: 'transparent' }}>
            <Edit2 size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(info.row.original); }} className="btn" style={{ padding: '6px', color: 'var(--danger)', background: 'transparent' }}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    })
  ], []);

  return (
    <div className="p-2">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage staff members and their information
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <UserPlus size={18} /> Add New Staff
          </button>
        </div>
      </div>

      <DataTable
        title="Staff Management"
        subtitle="View and manage staff members"
        icon={<Users size={24} color="var(--primary)" />}
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search staff by name, department, or position..."
      />

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-in fade-in zoom-in duration-200">
            <div className="modal-header">
              <h2 className="modal-title">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>
            <StaffForm
              formData={formData}
              onFormDataChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
              onSubmit={handleSubmit}
              isSaving={isSaving}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};