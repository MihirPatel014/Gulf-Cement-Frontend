import React, { useState, useEffect, useMemo } from 'react';
import {
  createColumnHelper
} from '@tanstack/react-table';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  Mail,
  User as UserIcon,
  MapPin,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '../api/user.api';
import { User } from '../types/user.types';
import { LoadingButton } from '../../../components/ui/LoadingButton';
import { DataTable } from '../../../components/ui/DataTable';
import { RoleSelect } from '../../../components/ui/RoleSelect';
import { ColumnFiltersState } from '@tanstack/react-table';
import { UserType } from '../../auth/types/auth.types';

const columnHelper = createColumnHelper<User>();

export const UserManagementPage: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    roleId: 0,
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll();
      if (res.success) setData(res.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName}?`)) return;
    try {
      await userApi.delete(user.id);
      toast.success('User deleted successfully');
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        password: '',
        roleId: user.roleId,
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        city: user.city || '',
        stateProvince: user.stateProvince || '',
        postalCode: user.postalCode || '',
        country: user.country || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        roleId: 0,
        addressLine1: '',
        addressLine2: '',
        city: '',
        stateProvince: '',
        postalCode: '',
        country: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingUser) {
        await userApi.update({
          id: editingUser.id,
          fullName: formData.fullName,
          userName: formData.userName,
          email: formData.email,
          roleId: Number(formData.roleId),
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          postalCode: formData.postalCode,
          country: formData.country
        });
        toast.success('User updated');
      } else {
        await userApi.create({
          fullName: formData.fullName,
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          roleId: Number(formData.roleId),
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          postalCode: formData.postalCode,
          country: formData.country
        });
        toast.success('User created');
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
    columnHelper.accessor('fullName', {
      header: 'User Info',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="header-avatar" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
            {info.getValue().charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{info.getValue()}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
              <span className="flex items-center gap-1"><Mail size={12} /> {info.row.original.email}</span>
            </div>
          </div>
        </div>
      )
    }),
    columnHelper.accessor('userName', {
      header: 'Username',
      cell: info => <span className="flex items-center gap-1"><UserIcon size={13} strokeWidth={1.5} /> {info.getValue()}</span>
    }),
    columnHelper.accessor('userType', {
      header: 'Type',
      cell: info => {
        const isStaff = info.getValue() === UserType.STAFF;
        return (
          <span className={`badge ${isStaff ? 'badge-staff' : 'badge-customer'}`}>
            {isStaff ? 'Staff' : 'Customer'}
          </span>
        );
      }
    }),
    columnHelper.accessor('role', {
      header: 'System Role',
      cell: info => (
        <div className="badge badge-role">
          <Shield size={12} />
          {info.getValue() || 'Unassigned'}
        </div>
      )
    }),
    columnHelper.accessor('roleId', {
      header: 'roleId',
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        return String(row.getValue(columnId)) === String(filterValue);
      },
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
      <DataTable
        title="User Management"
        subtitle="Manage system access and privileges for staff and customers"
        icon={<Users size={24} color="var(--primary)" />}
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search users by name, email or role..."
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        hiddenColumns={['roleId']}
        headerActions={
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <UserPlus size={18} /> Add New User
          </button>
        }
        filters={
          <RoleSelect
            className="mb-0"
            value={(columnFilters.find(f => f.id === 'roleId')?.value as string) || ''}
            onChange={(val) => {
              setColumnFilters(val ? [{ id: 'roleId', value: val }] : []);
            }}
            showAllOption={true}
            allOptionLabel="All Roles"
          />
        }
      />

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-in fade-in zoom-in duration-200">
            <div className="modal-header">
              <h2 className="modal-title">{editingUser ? 'Edit User' : 'Create New User'}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-input"
                    value={formData.userName}
                    onChange={e => setFormData({ ...formData, userName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                )}
                <RoleSelect
                  label="System Role"
                  value={formData.roleId}
                  onChange={(val) => setFormData({ ...formData, roleId: Number(val) })}
                />

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">Address Line 1</label>
                      <input
                        className="form-input"
                        value={formData.addressLine1}
                        onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                        placeholder="Street address, P.O. box"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                          className="form-input"
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State / Province</label>
                        <input
                          className="form-input"
                          value={formData.stateProvince}
                          onChange={e => setFormData({ ...formData, stateProvince: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Postal Code</label>
                        <input
                          className="form-input"
                          value={formData.postalCode}
                          onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input
                          className="form-input"
                          value={formData.country}
                          onChange={e => setFormData({ ...formData, country: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" style={{ borderColor: 'var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <LoadingButton type="submit" loading={isSaving} className="btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


