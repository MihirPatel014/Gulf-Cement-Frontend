import React, { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { transportApi } from '../api/transport.api';
import { Driver } from '../types/transport.types';
import { DriverList } from './DriverList';
import { CreateDriver } from './CreateDriver';

export const Drivers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ['drivers'],
    queryFn: transportApi.getDrivers,
    select: (res: any) => {
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (res?.success && Array.isArray(res.data)) return res.data;
      return [];
    }
  });

  const renderCount = useRef(0);
  renderCount.current++;
  console.log('[Drivers] render #', renderCount.current, { isModalOpen, loading, dataLen: data.length });

  const handleOpenCreate = useCallback(() => {
    setSelectedDriver(null);
    setIsModalOpen(true);
    console.log('[Drivers] handleOpenCreate called');
    console.log("isModalOpen", isModalOpen);
  }, []);

  const handleOpenEdit = useCallback((driver: Driver) => {
    setSelectedDriver({ ...driver });
    setIsModalOpen(true);
    console.log('[Drivers] handleOpenEdit called');
    console.log("isModalOpen", isModalOpen);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  }, []);

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

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  return (
    <div className="space-y-6" style={{ paddingBottom: '40px' }}>
      <DriverList
        drivers={data}
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onAdd={handleOpenCreate}
      />

      {isModalOpen && (
        <CreateDriver
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['drivers'] })}
          driver={selectedDriver}
        />
      )}
    </div>
  );
};
