import React, { useState, useEffect } from 'react';
import { Truck, X, Save, AlertCircle, Scale, Hash, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { transportApi } from '../api/transport.api';
import { LoadingButton } from '../../../components/ui/LoadingButton';
import { Vehicle } from '../types/transport.types';

interface CreateVehicleProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicle?: Vehicle | null;
}

export const CreateVehicle: React.FC<CreateVehicleProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vehicle = null
}) => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleType: 'BAG',
    maxCapacity: 0,
    model: '',
    isActive: true
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        plateNumber: vehicle?.plateNumber || '',
        vehicleType: vehicle?.vehicleType || 'BAG',
        maxCapacity: vehicle?.maxCapacity || 0,
        model: vehicle?.model || '',
        isActive: vehicle?.isActive ?? true
      });
    }
  }, [vehicle, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: any) => vehicle && vehicle.id ? transportApi.updateVehicle({ ...data, id: vehicle.id }) : transportApi.createVehicle(data),
    onSuccess: (res: any) => {
      if (res.success || Array.isArray(res) || res.id) {
        toast.success(vehicle ? 'Vehicle updated successfully!' : 'Vehicle created successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Failed to save vehicle');
      }
    },
    onError: () => {
      toast.error('An unexpected error occurred.');
    }
  });

  const isSaving = mutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '550px' }} onMouseDown={e => e.stopPropagation()}>
        <div className="modal-header">
           <div className="flex items-center gap-3">
              <Truck size={20} color="var(--primary)" />
              <h2 className="modal-title">
                {vehicle ? 'Modify Vehicle Record' : 'New Vehicle Registry'}
              </h2>
           </div>
           <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
             <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Plate Number</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="form-input"
                    style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                    value={formData.plateNumber}
                    onChange={e => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g. ABU-12345"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Vehicle Type</label>
                  <select
                    className="form-input"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                    value={formData.vehicleType}
                    onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                  >
                    <option value="BAG">Bag Truck</option>
                    <option value="BULK">Bulk Carrier</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Max Capacity (Tons)</label>
                  <div style={{ position: 'relative' }}>
                    <Scale size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                      value={formData.maxCapacity}
                      onChange={e => setFormData({ ...formData, maxCapacity: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="e.g. 40"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Model / Details</label>
                <div style={{ position: 'relative' }}>
                  <Info size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="form-input"
                    style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Volvo FH16 2024"
                  />
                </div>
              </div>

              {vehicle && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  <input
                    type="checkbox"
                    id="vehicle-active"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="vehicle-active" style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Vehicle In Service</label>
                </div>
              )}

              <div style={{ padding: '12px 16px', background: 'var(--info-bg)', border: '1px solid var(--info)', borderRadius: 'var(--radius)', display: 'flex', gap: '12px', alignItems: 'start' }}>
                <AlertCircle size={18} color="var(--info)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: 'var(--info)', margin: 0, lineHeight: '1.5' }}>
                  <strong>Fleet Note:</strong> All vehicles must pass safety inspection before being marked as active. Plate numbers must match official registration.
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" style={{ background: 'white', border: '1px solid var(--border)' }} onClick={onClose}>
              Cancel
            </button>
            <LoadingButton type="submit" loading={isSaving} className="btn-primary" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
              {!isSaving && <Save size={18} style={{ marginRight: '8px' }} />}
              {vehicle ? 'Save Changes' : 'Add Vehicle'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
