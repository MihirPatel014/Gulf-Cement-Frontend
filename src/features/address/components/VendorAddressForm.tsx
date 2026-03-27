import React from 'react';
import { AddressModal } from './AddressModal';

interface VendorAddressFormProps {
  vendorId: number;
  formData: any;
  onFormDataChange: (data: Partial<any>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  onClose: () => void;
}

export const VendorAddressForm: React.FC<VendorAddressFormProps> = ({
  vendorId,
  formData,
  onFormDataChange,
  onSubmit,
  isSaving,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AddressModal
        entityType="VENDOR"
        entityId={vendorId}
        formData={formData}
        onFormDataChange={onFormDataChange}
        onClose={onClose}
      />
      
      <div className="modal-footer">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};