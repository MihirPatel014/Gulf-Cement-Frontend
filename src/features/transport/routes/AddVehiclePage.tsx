import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { CreateVehicle } from '../components/CreateVehicle';

export const AddVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-2 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/master/transport/vehicles" className="btn btn-outline p-2" title="Go back">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Vehicle</h1>
          <p className="text-sm text-muted-foreground">Register a new vehicle in the transport master fleet</p>
        </div>
      </div>

      <div className="card p-2">
        <CreateVehicle
          isOpen={true}
          onClose={() => navigate({ to: '/master/transport/vehicles' })}
          onSuccess={() => navigate({ to: '/master/transport/vehicles' })}
        />
      </div>
    </div>
  );
};
