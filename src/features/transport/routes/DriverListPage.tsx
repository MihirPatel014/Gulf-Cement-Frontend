import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DriverList } from '../components/DriverList';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportApi } from '../api/transport.api';
import { toast } from 'sonner';

export const DriverListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data = [], isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: transportApi.getDrivers,
    select: (res: any) => {
      if (Array.isArray(res)) return res;
      return res?.data || res?.data?.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: transportApi.deleteDriver,
    onSuccess: () => {
      toast.success('Driver deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
    onError: () => {
      toast.error('Failed to delete driver');
    }
  });

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Drivers Master</h1>
          <p className="text-sm text-muted-foreground">Manage transportation drivers</p>
        </div>
      </div>
      <div className="card">
        <DriverList
          drivers={data}
          isLoading={isLoading}
          onEdit={(driver) => navigate({ to: '/master/transport/drivers/add', search: { id: driver.id } })}
          onDelete={(id) => {
            if (window.confirm('Delete this driver?')) {
              deleteMutation.mutate(id);
            }
          }}
          onAdd={() => navigate({ to: '/master/transport/drivers/add' })}
        />
      </div>
    </div>
  );
};
