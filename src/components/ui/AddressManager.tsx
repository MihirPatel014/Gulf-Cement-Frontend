import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';

export type AddressItem = {
  addressName: string;
  addressType: 'HOME' | 'OFFICE' | 'BILLING' | 'SHIPPING' | 'OTHER';
  isPrimary: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

const emptyAddress = (): AddressItem => ({
  addressName: '',
  addressType: 'OFFICE',
  isPrimary: false,
  addressLine1: '',
  city: '',
  stateProvince: '',
  postalCode: '',
  country: 'United Arab Emirates',
});

interface AddressManagerProps {
  addresses: AddressItem[];
  onChange: (addresses: AddressItem[]) => void;
}

export const AddressManager: React.FC<AddressManagerProps> = ({ addresses, onChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<AddressItem>(emptyAddress());

  const openForm = () => {
    setDraft({ ...emptyAddress(), isPrimary: addresses.length === 0 });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setDraft(emptyAddress());
  };

  const saveAddress = () => {
    if (!draft.addressLine1 || !draft.city) {
      alert('City and Full Address are required.');
      return;
    }
    onChange([...addresses, draft]);
    cancelForm();
  };

  const remove = (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    if (updated.length > 0 && !updated.some(a => a.isPrimary)) updated[0].isPrimary = true;
    onChange(updated);
  };

  const setPrimary = (idx: number) => {
    onChange(addresses.map((a, i) => ({ ...a, isPrimary: i === idx })));
  };

  return (
    <div className="address-manager">
      {/* Header */}
      <div className="am-header">
        <span className="am-title">
          <MapPin size={16} className="am-icon" />
          Delivery Addresses
        </span>
        <button type="button" className="am-add-btn" onClick={openForm}>
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Inline Add Form */}
      {showForm && (
        <div className="am-form">
          <div className="am-form-group">
            <label className="am-label">Label</label>
            <input
              className="am-input"
              placeholder="e.g. Main Warehouse"
              value={draft.addressName}
              onChange={e => setDraft({ ...draft, addressName: e.target.value })}
            />
          </div>
          <div className="am-form-row">
            <div className="am-form-group">
              <label className="am-label">City *</label>
              <input
                className="am-input"
                placeholder="e.g. Dubai"
                value={draft.city}
                onChange={e => setDraft({ ...draft, city: e.target.value })}
              />
            </div>
            <div className="am-form-group">
              <label className="am-label">Full Address *</label>
              <input
                className="am-input"
                placeholder="Street, area, landmark"
                value={draft.addressLine1}
                onChange={e => setDraft({ ...draft, addressLine1: e.target.value })}
              />
            </div>
          </div>
          <div className="am-form-row">
            <div className="am-form-group">
              <label className="am-label">Latitude</label>
              <input
                className="am-input"
                type="number"
                step="any"
                placeholder="25.1234"
                value={draft.latitude ?? ''}
                onChange={e => setDraft({ ...draft, latitude: parseFloat(e.target.value) || undefined })}
              />
            </div>
            <div className="am-form-group">
              <label className="am-label">Longitude</label>
              <input
                className="am-input"
                type="number"
                step="any"
                placeholder="55.1234"
                value={draft.longitude ?? ''}
                onChange={e => setDraft({ ...draft, longitude: parseFloat(e.target.value) || undefined })}
              />
            </div>
          </div>
          <div className="am-form-actions">
            <button type="button" className="am-cancel-btn" onClick={cancelForm}>Cancel</button>
            <button type="button" className="am-save-btn" onClick={saveAddress}>
              <MapPin size={14} /> Save Address
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="am-list">
        {addresses.length === 0 && !showForm && (
          <p className="am-empty">No addresses added yet.</p>
        )}
        {addresses.map((addr, idx) => (
          <div key={idx} className={`am-item ${addr.isPrimary ? 'am-item-primary' : ''}`}>
            <div className="am-item-icon">
              <MapPin size={15} />
            </div>
            <div className="am-item-body">
              <div className="am-item-name">
                {addr.addressName || addr.city}
                {addr.isPrimary && <span className="am-primary-badge">Primary</span>}
              </div>
              <div className="am-item-sub">{addr.addressLine1}, {addr.city}</div>
              {(addr.latitude || addr.longitude) && (
                <div className="am-item-gps">GPS: {addr.latitude}, {addr.longitude}</div>
              )}
            </div>
            <div className="am-item-actions">
              {!addr.isPrimary && (
                <button type="button" className="am-star-btn" title="Set as Primary" onClick={() => setPrimary(idx)}>
                  <Star size={14} />
                </button>
              )}
              <button type="button" className="am-remove-btn" title="Remove" onClick={() => remove(idx)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
