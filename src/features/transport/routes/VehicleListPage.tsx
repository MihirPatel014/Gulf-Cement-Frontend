import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { VehicleList } from '../components/VehicleList';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportApi } from '../api/transport.api';
import { toast } from 'sonner';

export const VehicleListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: transportApi.getVehicles,
    select: (res: any) => {
      if (Array.isArray(res)) return res;
      return res?.data || res?.data?.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: transportApi.deleteVehicle,
    onSuccess: () => {
      toast.success('Vehicle deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: () => {
      toast.error('Failed to delete vehicle');
    }
  });

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vehicles Registry</h1>
          <p className="text-sm text-muted-foreground">Manage transportation fleet</p>
        </div>
      </div>
      <div className="card">
        <VehicleList
          vehicles={data}
          isLoading={isLoading}
          onEdit={(vehicle) => navigate({ to: '/master/transport/vehicles/add', search: { id: vehicle.id } })}
          onDelete={(id) => {
            if (window.confirm('Delete this vehicle?')) {
              deleteMutation.mutate(id);
            }
          }}
          onAdd={() => navigate({ to: '/master/transport/vehicles/add' })}
        />
      </div>
    </div>
  );
};
