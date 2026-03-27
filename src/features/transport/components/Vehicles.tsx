import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transportApi } from '../api/transport.api';
import { Vehicle } from '../types/transport.types';
import { VehicleList } from './VehicleList';
import { CreateVehicle } from './CreateVehicle';

export const Vehicles: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: transportApi.getVehicles,
    select: (res: any) => {
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (res?.success && Array.isArray(res.data)) return res.data;
      return [];
    }
  });

  const handleOpenCreate = useCallback(() => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle({ ...vehicle });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  }, []);

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

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  return (
    <div className="space-y-6" style={{ paddingBottom: '40px' }}>
      <VehicleList
        vehicles={data}
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onAdd={handleOpenCreate}
      />

      {isModalOpen && (
        <CreateVehicle
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['vehicles'] })}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
};
