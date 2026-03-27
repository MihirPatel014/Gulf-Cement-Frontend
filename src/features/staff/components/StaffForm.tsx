import { X } from 'lucide-react';
import React from 'react';

interface StaffFormProps {
  formData: any;
  onFormDataChange: (data: Partial<any>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  onClose: () => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  isSaving,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {formData.userId ? 'Edit Staff' : 'Add New Staff'}
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground/80">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* User ID */}
        <div>
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="number"
            value={formData.userId}
            onChange={(e) => onFormDataChange({ userId: parseInt(e.target.value) || 0 })}
            placeholder="Enter user ID"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
            required
            min="1"
          />
        </div>

        {/* Employee Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Employee Code</label>
          <input
            type="text"
            value={formData.employeeCode}
            onChange={(e) => onFormDataChange({ employeeCode: e.target.value })}
            placeholder="Enter employee code"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
          />
        </div>

        {/* Department */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => onFormDataChange({ department: e.target.value })}
            placeholder="Enter department"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
          />
        </div>

        {/* Position Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Position Title</label>
          <input
            type="text"
            value={formData.positionTitle}
            onChange={(e) => onFormDataChange({ positionTitle: e.target.value })}
            placeholder="Enter position title"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:focus-visible:outline-none"
          />
        </div>

        {/* Address Information Section */}
        <div className="col-span-2 border-t pt-4 mt-2">
          <h4 className="text-sm font-semibold mb-3">Address Information</h4>
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
      
      <div className="modal-footer">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? 'Saving...' : 'Save Staff'}
        </button>
      </div>
    </form>
  );
};