'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { DataCucianService } from '../service/dataCucianService';
import { DataCucianMutations } from '../mutations/dataCucianMutations';
import { StatusFilterTab } from '../types';

export function useDataCucianViewModel() {
  const [allOrders, setAllOrders] = useState<LaundryOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('Semua layanan');
  const [activeTab, setActiveTab] = useState<StatusFilterTab>('semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync data store
  const refresh = useCallback(() => {
    setAllOrders(dataStore.getOrders());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = dataStore.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  // Derived statistics
  const stats = useMemo(() => DataCucianService.getStats(allOrders), [allOrders]);

  // Derived service summaries
  const serviceSummaries = useMemo(
    () => DataCucianService.getServiceSummaries(allOrders),
    [allOrders]
  );

  // Tab count badges
  const tabCounts = useMemo(() => {
    return {
      semua: allOrders.length,
      dalam_proses: allOrders.filter((o) =>
        ['Diterima', 'Dicuci', 'Disetrika'].includes(o.status)
      ).length,
      siap_diambil: allOrders.filter((o) => o.status === 'Siap diambil').length,
      selesai: allOrders.filter((o) => o.status === 'Selesai').length,
    };
  }, [allOrders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return DataCucianService.filterOrders(
      allOrders,
      searchQuery,
      selectedService,
      activeTab
    );
  }, [allOrders, searchQuery, selectedService, activeTab]);

  // Action handlers
  const handleStatusChange = (id: string, newStatus: LaundryOrder['status']) => {
    DataCucianMutations.updateStatus(id, newStatus);
  };

  const handleCreateOrder = (data: any) => {
    DataCucianMutations.createOrder(data);
    setIsAddModalOpen(false);
  };

  return {
    allOrders,
    filteredOrders,
    stats,
    serviceSummaries,
    searchQuery,
    setSearchQuery,
    selectedService,
    setSelectedService,
    activeTab,
    setActiveTab,
    tabCounts,
    isAddModalOpen,
    openAddModal: () => setIsAddModalOpen(true),
    closeAddModal: () => setIsAddModalOpen(false),
    handleStatusChange,
    handleCreateOrder,
  };
}
