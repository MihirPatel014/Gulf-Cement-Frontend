import React, { useState, useEffect } from 'react';
import { UserPlus, X, Save, AlertCircle, Phone, CreditCard, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { transportApi } from '../api/transport.api';
import { LoadingButton } from '../../../components/ui/LoadingButton';
import { Driver } from '../types/transport.types';

interface CreateDriverProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driver?: Driver | null;
}

export const CreateDriver: React.FC<CreateDriverProps> = ({
  isOpen,
  onClose,
  onSuccess,
  driver = null
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    licenseNumber: '',
    phone: '',
    identityNumber: '',
    isActive: true
  });
  console.log("isOpen", isOpen);
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: driver?.fullName || '',
        licenseNumber: driver?.licenseNumber || '',
        phone: driver?.phone || '',
        identityNumber: driver?.identityNumber || '',
        isActive: driver?.isActive ?? true
      });
    }
  }, [driver, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: any) => driver && driver.id ? transportApi.updateDriver({ ...data, id: driver.id }) : transportApi.createDriver(data),
    onSuccess: (res: any) => {
      if (res.success || Array.isArray(res) || res.id) {
        toast.success(driver ? 'Driver updated successfully!' : 'Driver created successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Failed to save driver');
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
            <UserPlus size={20} color="var(--primary)" />
            <h2 className="modal-title">
              {driver ? 'Modify Driver Record' : 'New Driver Registry'}
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
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Full Name</label>
                <input
                  className="form-input"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>License ID</label>
                  <div style={{ position: 'relative' }}>
                    <Award size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                      value={formData.licenseNumber}
                      onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                      required
                      placeholder="L-12345"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Identity Card (EID)</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="form-input"
                    style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'monospace' }}
                    value={formData.identityNumber}
                    onChange={e => setFormData({ ...formData, identityNumber: e.target.value })}
                    placeholder="784-XXXX-XXXXXXX-X"
                  />
                </div>
              </div>

              {driver && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="is-active" style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Active Driver Record</label>
                </div>
              )}

              <div style={{ padding: '12px 16px', background: 'var(--info-bg)', border: '1px solid var(--info)', borderRadius: 'var(--radius)', display: 'flex', gap: '12px', alignItems: 'start' }}>
                <AlertCircle size={18} color="var(--info)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: 'var(--info)', margin: 0, lineHeight: '1.5' }}>
                  <strong>Verification Notice:</strong> Official verification takes 2-4 hours. Please double check all official documents.
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
              {driver ? 'Save Changes' : 'Add Register'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
