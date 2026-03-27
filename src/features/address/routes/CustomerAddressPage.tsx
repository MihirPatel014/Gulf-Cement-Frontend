import React, { useState, useEffect, useMemo } from 'react';
import {
  createColumnHelper
} from '@tanstack/react-table';
import {
  Users,
  Edit2,
  Trash2,
  MapPin,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { addressApi } from '../api/address.api';
import { Address } from '../types/address.types';
import { DataTable } from '../../../components/ui/DataTable';
import { CustomerAddressForm } from '../components/CustomerAddressForm';

const columnHelper = createColumnHelper<Address>();

export const CustomerAddressPage: React.FC = () => {
  const [data, setData] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<number | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for adding new address
  const [formData, setFormData] = useState({
    entityType: 'CUSTOMER',
    entityId: 0,
    addressType: 'OFFICE',
    isPrimary: false,
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    isActive: true
  });

  useEffect(() => {
    // Try to get customer ID from URL or context
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('customerId');
    if (idParam) {
      setCustomerId(parseInt(idParam));
      fetchCustomerAddresses(parseInt(idParam));
    }
  }, []);

  const fetchCustomerAddresses = async (customerId: number) => {
    try {
      setLoading(true);
      const res = await addressApi.getByEntity('CUSTOMER', customerId);
      if (res.success) setData(res.data);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (address: Address) => {
    if (!window.confirm(`Are you sure you want to delete this address?`)) return;
    try {
      await addressApi.delete(address.id);
      toast.success('Address deleted successfully');
      if (customerId) {
        fetchCustomerAddresses(customerId);
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        entityType: address.entityType,
        entityId: address.entityId,
        addressType: address.addressType,
        isPrimary: address.isPrimary,
        addressLine1: address.addressLine1 || '',
        addressLine2: address.addressLine2 || '',
        city: address.city || '',
        stateProvince: address.stateProvince || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        isActive: address.isActive
      });
    } else {
      setEditingAddress(null);
      setFormData({
        entityType: 'CUSTOMER',
        entityId: customerId || 0,
        addressType: 'OFFICE',
        isPrimary: false,
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
      if (editingAddress) {
        await addressApi.update({
          id: editingAddress.id,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          postalCode: formData.postalCode,
          country: formData.country,
          isPrimary: formData.isPrimary,
          isActive: formData.isActive
        });
        toast.success('Address updated');
      } else {
        await addressApi.create({
          entityType: formData.entityType,
          entityId: formData.entityId,
          addressType: formData.addressType,
          isPrimary: formData.isPrimary,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          postalCode: formData.postalCode,
          country: formData.country,
          isActive: formData.isActive
        });
        toast.success('Address created');
      }
      setIsModalOpen(false);
      if (customerId) {
        fetchCustomerAddresses(customerId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor('addressLine1', {
      header: 'Address Line 1',
      cell: info => <span>{info.getValue()}</span>
    }),
    columnHelper.accessor('addressLine2', {
      header: 'Address Line 2',
      cell: info => <span>{info.getValue() || '-'}</span>
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
    columnHelper.accessor('addressType', {
      header: 'Address Type',
      cell: info => {
        const typeMap: Record<string, string> = {
          HOME: 'Home',
          OFFICE: 'Office',
          BILLING: 'Billing',
          SHIPPING: 'Shipping',
          OTHER: 'Other'
        };
        return <span className="badge">{typeMap[info.getValue()] || info.getValue()}</span>;
      }
    }),
    columnHelper.accessor('isPrimary', {
      header: 'Primary',
      cell: info => (
        <span className={`badge ${info.getValue() ? 'badge-success' : 'badge-secondary'}`}>
          {info.getValue() ? 'Yes' : 'No'}
        </span>
      )
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
          <h1 className="text-2xl font-bold">Customer Addresses</h1>
          <p className="text-sm text-muted-foreground">
            Manage addresses for customers
          </p>
        </div>
        <div className="flex space-x-3">
          {customerId && (
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <MapPin size={18} /> Add New Address
            </button>
          )}
        </div>
      </div>

      {customerId === null ? (
        <div className="alert alert-info">
          Please select a customer to view their addresses.
        </div>
      ) : (
        <>
          <DataTable
            title="Customer Addresses"
            subtitle={`Manage addresses for customer ID: ${customerId}`}
            icon={<Users size={24} color="var(--primary)" />}
            columns={columns}
            data={data}
            isLoading={loading}
            searchPlaceholder="Search addresses by city, state, or address line..."
          />

          {/* MODAL */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content animate-in fade-in zoom-in duration-200">
                <div className="modal-header">
                  <h2 className="modal-title">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <CustomerAddressForm
                  customerId={customerId}
                  formData={formData}
                  onFormDataChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                  onSubmit={handleSubmit}
                  isSaving={isSaving}
                  onClose={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};