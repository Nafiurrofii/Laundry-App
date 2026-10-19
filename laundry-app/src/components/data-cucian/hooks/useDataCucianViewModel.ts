'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataStore } from '@/lib/dataStore';
import type { TransactionWithRelations, LaundryStatus } from '@/lib/database.types';
import { DataCucianService } from '../service/dataCucianService';
import { DataCucianMutations } from '../mutations/dataCucianMutations';
import { StatusFilterTab } from '../types';

export function useDataCucianViewModel() {
  const [allOrders, setAllOrders] = useState<TransactionWithRelations[]>(() =>
    dataStore.getOrders()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('Semua layanan');
  const [activeTab, setActiveTab] = useState<StatusFilterTab>('semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync data store
  const refresh = useCallback(() => {
    setAllOrders(dataStore.getOrders());
  }, []);

  const syncData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const orders = await DataCucianService.fetchAllFromDatabase();
      setAllOrders(orders);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(true);
    DataCucianService.fetchAllFromDatabase().finally(() => {
      setIsLoading(false);
    });

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

  // Tab count badges – sesuai DB status enum
  const tabCounts = useMemo(() => {
    return {
      semua: allOrders.length,
      dalam_proses: allOrders.filter((o) =>
        ['Received', 'Processing'].includes(o.status)
      ).length,
      siap_diambil: allOrders.filter((o) => o.status === 'Completed').length,
      selesai: allOrders.filter((o) => o.status === 'Picked Up').length,
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
  const handleStatusChange = async (receiptNumber: string, newStatus: LaundryStatus) => {
    await DataCucianMutations.updateStatus(receiptNumber, newStatus);
  };

  const handleCreateOrder = async (data: any) => {
    setIsAddModalOpen(false);
    await DataCucianMutations.createOrder(data);
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
    isLoading,
    isSyncing,
    syncData,
    openAddModal: () => setIsAddModalOpen(true),
    closeAddModal: () => setIsAddModalOpen(false),
    handleStatusChange,
    handleCreateOrder,
  };
}

