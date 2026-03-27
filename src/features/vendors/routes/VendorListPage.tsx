import React from 'react';
import { Building, PlusCircle } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Link } from '@tanstack/react-router';

export const VendorListPage: React.FC = () => {
  return (
    <div className="p-2">
      <DataTable
        title="Vendor Management"
        subtitle="Manage and view vendor information"
        icon={<Building size={24} color="var(--primary)" />}
        columns={[]} // Add columns later
        data={[]}
        isLoading={false}
        searchPlaceholder="Search vendors..."
        headerActions={
          <Link to="/master/vendors/add" className="btn btn-primary">
            <PlusCircle size={18} /> Add New Vendor
          </Link>
        }
      />
    </div>
  );
};
