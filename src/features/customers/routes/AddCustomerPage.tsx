import React, { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { LoadingButton } from '../../../components/ui/LoadingButton';

export const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'United Arab Emirates'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Customer created successfully');
      navigate({ to: '/master/customers' });
    } catch (error) {
      toast.error('Failed to create customer');
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

      <div className="card p-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  className="form-input"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  required
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

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="form-group">
                <label className="form-label">Address Line 1</label>
                <input
                  className="form-input"
                  placeholder="Street address, P.O. box, company name, c/o"
                  value={formData.addressLine1}
                  onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  className="form-input"
                  placeholder="City"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input
                  className="form-input"
                  placeholder="State / Province"
                  value={formData.stateProvince}
                  onChange={e => setFormData({ ...formData, stateProvince: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  className="form-input"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  className="form-input"
                  placeholder="Country"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8 bt-1 pt-6 border-t">
            <Link to="/master/customers" className="btn">Cancel</Link>
            <LoadingButton type="submit" loading={isSaving} className="btn-primary">
              Save Customer
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
