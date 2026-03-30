import React, { useState } from 'react';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCreateProductMutation } from '../hooks/use-products-query';
import { LoadingButton } from '../../../components/ui/LoadingButton';

import { useNextSequenceQuery } from '../../common/hooks/use-next-sequence-number';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProductMutation();
  const { data: nextProductSequence } = useNextSequenceQuery("PRODUCT");
  const nextProductCode = nextProductSequence?.nextNumber || "";

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price: 0,
    packaging: 'Bag',
    unit: 'Kilogram',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        navigate({ to: '/master/products' });
      }
    });
  };

  return (
    <div className="p-2 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/master/products" className="btn btn-outline p-2" style={{ border: '1px solid var(--border)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} className="text-primary" />
            Add New Product
          </h1>
          <p className="text-sm text-muted-foreground">Define a new master product entry</p>
        </div>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="form-group">
              <label className="form-label font-semibold mb-2 block">Product Name</label>
              <input
                className="form-input w-full p-3 border rounded-lg"
                placeholder="e.g. Portland Cement"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label font-semibold mb-2 block flex justify-between">
                <span>Product Code</span>
                {nextProductCode && <span className="text-xs text-primary font-normal">Next: {nextProductCode}</span>}
              </label>
              <input
                className="form-input w-full p-3 border rounded-lg font-mono uppercase"
                placeholder={nextProductCode || "e.g. CEM-OPC-01"}
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="form-group">
              <label className="form-label font-semibold mb-2 block">Price</label>
              <input
                type="number"
                className="form-input w-full p-3 border rounded-lg"
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label font-semibold mb-2 block">Packaging</label>
              <select
                className="form-input w-full p-3 border rounded-lg"
                value={formData.packaging}
                onChange={e => setFormData({ ...formData, packaging: e.target.value })}
              >
                <option value="Bag">50kg Bag</option>
                <option value="Bulk">Bulk / Loose</option>
                <option value="Jumbo">Jumbo Bag</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label font-semibold mb-2 block">Unit</label>
              <select
                className="form-input w-full p-3 border rounded-lg"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="Kilogram">Kilogram (kg)</option>
                <option value="Metric Ton">Metric Ton (MT)</option>
                <option value="Bag">Bag</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label font-semibold mb-2 block">Description</label>
            <textarea
              className="form-input w-full p-3 border rounded-lg"
              placeholder="Enter product description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Set product as active and visible in catalogs</label>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Link to="/master/products" className="btn px-6 py-2">Cancel</Link>
            <LoadingButton
              type="submit"
              loading={createMutation.isPending}
              className="btn btn-primary px-8 flex items-center gap-2"
            >
              {!createMutation.isPending && <Save size={18} />}
              Save Product Record
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
