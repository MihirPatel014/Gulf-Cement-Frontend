import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Link } from '@tanstack/react-router';

export const CustomerListPage: React.FC = () => {
  return (
    <div className="p-2">
      <DataTable
        title="Customer Management"
        subtitle="View and manage customer accounts"
        icon={<Users size={24} color="var(--primary)" />}
        columns={[]} // Add columns later
        data={[]}
        isLoading={false}
        searchPlaceholder="Search customers..."
        headerActions={
          <Link to="/master/customers/add" className="btn btn-primary">
            <UserPlus size={18} /> Add New Customer
          </Link>
        }
      />
    </div>
  );
};
