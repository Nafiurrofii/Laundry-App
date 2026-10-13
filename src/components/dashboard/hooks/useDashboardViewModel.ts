'use client';

import { useState, useEffect, useCallback } from 'react';
import { dataStore } from '@/lib/dataStore';
import { DashboardService } from '../service/dashboardService';
import { DashboardMutations } from '../mutations/dashboardMutations';
import { CreateOrderInput, DashboardViewModelState } from '../types';

export function useDashboardViewModel() {
  const [state, setState] = useState<DashboardViewModelState>({
    metrics: DashboardService.getMetrics(),
    revenueTrend: DashboardService.getRevenueTrend(),
    total7DaysRevenue: DashboardService.getTotal7DaysRevenue(),
    operationalStatus: DashboardService.getOperationalStatus(),
    recentOrders: DashboardService.getRecentOrders(3),
    isAddModalOpen: false,
    selectedDate: '8 Oktober 2026',
  });

  const refreshData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      metrics: DashboardService.getMetrics(),
      operationalStatus: DashboardService.getOperationalStatus(),
      recentOrders: DashboardService.getRecentOrders(3),
    }));
  }, []);

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(refreshData);
    return () => unsubscribe();
  }, [refreshData]);

  const openAddModal = () => {
    setState((prev) => ({ ...prev, isAddModalOpen: true }));
  };

  const closeAddModal = () => {
    setState((prev) => ({ ...prev, isAddModalOpen: false }));
  };

  const handleCreateOrder = (input: CreateOrderInput) => {
    DashboardMutations.createOrder(input);
    closeAddModal();
  };

  const handleQuickStatusChange = (id: string, status: any) => {
    DashboardMutations.updateStatus(id, status);
  };

  return {
    state,
    openAddModal,
    closeAddModal,
    handleCreateOrder,
    handleQuickStatusChange,
  };
}
