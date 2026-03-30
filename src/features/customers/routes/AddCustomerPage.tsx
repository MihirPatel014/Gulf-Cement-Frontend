import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { LoadingButton } from '../../../components/ui/LoadingButton';
import { useNextSequenceQuery } from '../../common/hooks/use-next-sequence-number';
import { AddressManager, AddressItem } from '../../../components/ui/AddressManager';
import { customerApiService } from '../../../services/adapters/customers.api';

export const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const { data: nextCustomerData } = useNextSequenceQuery("CUSTOMER");
  const nextCustomerCode = nextCustomerData?.nextNumber || "...";

  const [formData, setFormData] = useState({
    companyName: '',
    customerCode: '',
    email: '',
    phone: '',
    addresses: [] as AddressItem[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.addresses.length === 0) {
      toast.error('Please add at least one address');
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        companyName: formData.companyName,
        customerCode: formData.customerCode || undefined, // Backend will auto-assign if empty
        email: formData.email,
        phone: formData.phone,
        addresses: formData.addresses
      };

      await customerApiService.createCustomer(payload);
      toast.success('Customer registered successfully');
      navigate({ to: '/master/customers' });
    } catch (error) {
      toast.error('Failed to register customer');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-2 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/master/customers" className="btn btn-outline p-2">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Customer</h1>
          <p className="text-sm text-muted-foreground">Register a new customer account in the system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <div className="card p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group md:col-span-2">
                        <label className="form-label">Company Name *</label>
                        <input
                        className="form-input"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label font-semibold flex justify-between items-center">
                            Customer Code
                            <span className="text-[10px] text-primary font-bold bg-primary/5 px-1.5 py-0.5 rounded">
                                Next: {nextCustomerCode}
                            </span>
                        </label>
                        <input
                        className="form-input"
                        placeholder={`Auto-assigned: ${nextCustomerCode}`}
                        value={formData.customerCode}
                        onChange={e => setFormData({ ...formData, customerCode: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                        type="email"
                        className="form-input"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                        className="form-input"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    </div>
                </div>

                <div className="pt-4">
                   <AddressManager 
                    addresses={formData.addresses} 
                    onChange={(addresses) => setFormData({...formData, addresses})} 
                   />
                </div>

                <div className="flex justify-end gap-2 mt-8 pt-6 border-t font-semibold">
                    <Link to="/master/customers" className="btn">Cancel</Link>
                    <LoadingButton type="submit" loading={isSaving} className="btn-primary">
                    Save Customer
                    </LoadingButton>
                </div>
                </form>
            </div>
        </div>

        <div>
            <div className="card p-4 bg-slate-50 border-dashed border-2 sticky top-4">
                <h4 className="font-bold text-slate-800 mb-2">Customer Onboarding</h4>
                <ul className="text-xs space-y-2 text-slate-500">
                    <li className="flex gap-2">
                        <div className="h-1 w-1 bg-primary rounded-full mt-1.5 shrink-0"/>
                        Customer Code can be left blank for auto-generation based on sequence.
                    </li>
                    <li className="flex gap-2">
                        <div className="h-1 w-1 bg-primary rounded-full mt-1.5 shrink-0"/>
                        Add multiple delivery addresses. Mark the most frequent one as Primary.
                    </li>
                    <li className="flex gap-2">
                        <div className="h-1 w-1 bg-primary rounded-full mt-1.5 shrink-0"/>
                        Ensure email and phone are accurate for order notifications.
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

