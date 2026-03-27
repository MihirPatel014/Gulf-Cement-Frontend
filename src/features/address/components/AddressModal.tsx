import React from 'react';
import {
  MapPin,
  Home,
  Building,
  Truck,
  X
} from 'lucide-react';

interface AddressModalProps {
  entityType: 'CUSTOMER' | 'VENDOR';
  entityId: number;
  formData: {
    addressType: string;
    isPrimary: boolean;
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    isActive: boolean;
  };
  onFormDataChange: (data: Partial<{
    addressType: string;
    isPrimary: boolean;
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    isActive: boolean;
  }>) => void;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  entityType,
  entityId,
  formData,
  onFormDataChange,
  onClose
}) => {
  const addressTypes = [
    { value: 'HOME', label: 'Home', icon: <Home className="mr-2 h-4 w-4" /> },
    { value: 'OFFICE', label: 'Office', icon: <Building className="mr-2 h-4 w-4" /> },
    { value: 'BILLING', label: 'Billing', icon: <MapPin className="mr-2 h-4 w-4" /> },
    { value: 'SHIPPING', label: 'Shipping', icon: <Truck className="mr-2 h-4 w-4" /> },
    { value: 'OTHER', label: 'Other', icon: <MapPin className="mr-2 h-4 w-4" /> }
  ];

  const entityLabels: Record<'CUSTOMER' | 'VENDOR', string> = {
    CUSTOMER: 'Customer',
    VENDOR: 'Vendor'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          Add Address for {entityLabels[entityType]} #{entityId}
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground/80">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Address Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Address Type</label>
          <div className="relative">
            <select
              value={formData.addressType}
              onChange={(e) => onFormDataChange({ addressType: e.target.value as 'HOME' | 'OFFICE' | 'BILLING' | 'SHIPPING' | 'OTHER' })}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
            >
              {addressTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Is Primary */}
        <div>
          <label className="block text-sm font-medium mb-1">Primary Address</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => onFormDataChange({ isPrimary: e.target.checked })}
              className="h-4 w-4 rounded border-primary focus:border-primary"
            />
            <span className="ml-2 text-sm">Set as primary address</span>
          </div>
        </div>

        {/* Address Line 1 */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Address Line 1</label>
          <input
            type="text"
            value={formData.addressLine1}
            onChange={(e) => onFormDataChange({ addressLine1: e.target.value })}
            placeholder="Enter address line 1"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
            required
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
          <input
            type="text"
            value={formData.addressLine2}
            onChange={(e) => onFormDataChange({ addressLine2: e.target.value })}
            placeholder="Enter address line 2 (apartment, suite, etc.)"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onFormDataChange({ city: e.target.value })}
            placeholder="Enter city"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
            required
          />
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-sm font-medium mb-1">State/Province</label>
          <input
            type="text"
            value={formData.stateProvince}
            onChange={(e) => onFormDataChange({ stateProvince: e.target.value })}
            placeholder="Enter state or province"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => onFormDataChange({ postalCode: e.target.value })}
            placeholder="Enter postal code"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => onFormDataChange({ country: e.target.value })}
            placeholder="Enter country"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
            required
          />
        </div>

        {/* Is Active */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => onFormDataChange({ isActive: e.target.checked })}
              className="h-4 w-4 rounded border-primary focus:border-primary"
            />
            <span className="ml-2 text-sm">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};