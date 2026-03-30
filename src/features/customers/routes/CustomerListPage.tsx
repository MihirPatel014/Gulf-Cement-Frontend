import React, { useState } from 'react';
import { Users, UserPlus, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { useCustomersQuery } from '../hooks/use-customers-query';
import { ColumnDef } from '@tanstack/react-table';
import { CustomerDto, customerApiService } from '../../../services/adapters/customers.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingButton } from '../../../components/ui/LoadingButton';
import { useNextSequenceQuery } from '../../common/hooks/use-next-sequence-number';
import { AddressManager, AddressItem } from '../../../components/ui/AddressManager';

const defaultForm = () => ({
  companyName: '',
  customerCode: '',
  email: '',
  phone: '',
  addresses: [] as AddressItem[],
});

export const CustomerListPage: React.FC = () => {
  const { data: customers = [], isLoading } = useCustomersQuery({ pageSize: 100 });
  const queryClient = useQueryClient();
  const { data: nextSeq } = useNextSequenceQuery('CUSTOMER');
  const nextCode = nextSeq?.nextNumber ?? '...';

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(defaultForm());

  const openModal = () => {
    setForm(defaultForm());
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(defaultForm());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      toast.error('Company name is required');
      return;
    }
    if (form.addresses.length === 0) {
      toast.error('Please add at least one delivery address');
      return;
    }
    try {
      setIsSaving(true);
      await customerApiService.createCustomer({
        companyName: form.companyName,
        customerCode: form.customerCode || undefined,
        email: form.email,
        phone: form.phone,
        addresses: form.addresses,
      });
      toast.success('Customer registered successfully');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      closeModal();
    } catch {
      toast.error('Failed to register customer');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => customerApiService.deleteCustomer(id),
    onSuccess: () => {
      toast.success('Customer deleted');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (err: any) => toast.error('Failed to delete: ' + err.message),
  });

  const columns: ColumnDef<CustomerDto>[] = [
    {
      header: 'Customer Code',
      accessorKey: 'customerCode',
      cell: (info) => <span className="font-medium text-primary">{info.getValue() as string}</span>,
    },
    { header: 'Company Name', accessorKey: 'companyName' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Phone', accessorKey: 'phone' },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span className={`badge ${info.getValue() ? 'badge-success' : 'badge-danger'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {info.getValue() ? <CheckCircle size={13} /> : <XCircle size={13} />}
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: (info) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={() => window.confirm('Delete this customer?') && deleteMutation.mutate(info.row.original.id)}
            className="btn btn-sm btn-outline-danger"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2">
      <DataTable
        title="Customer Management"
        subtitle="View and manage customer accounts"
        icon={<Users size={24} color="var(--primary)" />}
        columns={columns}
        data={customers}
        isLoading={isLoading}
        searchPlaceholder="Search customers..."
        headerActions={
          <button className="btn btn-primary" onClick={openModal}>
            <UserPlus size={18} /> Add New Customer
          </button>
        }
      />

      {/* ===== CREATE CUSTOMER MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content modal-lg animate-in zoom-in">
            {/* Header */}
            <div className="modal-header">
              <div>
                <div className="modal-title">Add New Customer</div>
                <div className="modal-subtitle">Register a new customer account in the system</div>
              </div>
              <button className="modal-close-btn" onClick={closeModal} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Company Name */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Company Name *</label>
                  <input
                    className="form-input"
                    placeholder="Enter company name"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    required
                  />
                </div>

                {/* Code + Phone row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      Customer Code
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'rgba(11,61,145,0.06)', padding: '1px 6px', borderRadius: 4 }}>
                        Next: {nextCode}
                      </span>
                    </label>
                    <input
                      className="form-input"
                      placeholder={`Auto: ${nextCode}`}
                      value={form.customerCode}
                      onChange={(e) => setForm({ ...form, customerCode: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* Address Manager */}
                <AddressManager
                  addresses={form.addresses}
                  onChange={(addresses) => setForm({ ...form, addresses })}
                />
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <LoadingButton type="submit" loading={isSaving} className="btn-primary">
                  Save Customer
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
