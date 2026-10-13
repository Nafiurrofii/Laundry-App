'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { TransaksiService } from '../service/transaksiService';
import { TransaksiMutations } from '../mutations/transaksiMutations';
import { TransaksiFilter } from '../types';

export function useTransaksiViewModel() {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [filter, setFilter] = useState<TransaksiFilter>({
    search: '',
    paymentStatus: 'semua',
  });
  const [selectedOrder, setSelectedOrder] = useState<LaundryOrder | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const refresh = useCallback(() => {
    setOrders(dataStore.getOrders());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = dataStore.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const filteredOrders = useMemo(() => {
    return TransaksiService.filterTransactions(orders, filter);
  }, [orders, filter]);

  const viewReceipt = (order: LaundryOrder) => {
    setSelectedOrder(order);
    setIsReceiptModalOpen(true);
  };

  const closeReceipt = () => {
    setSelectedOrder(null);
    setIsReceiptModalOpen(false);
  };

  const handlePayOrder = (id: string, method: 'QRIS' | 'Tunai') => {
    TransaksiMutations.markAsPaid(id, method);
    refresh();
  };

  return {
    orders,
    filteredOrders,
    filter,
    setFilter,
    selectedOrder,
    isReceiptModalOpen,
    viewReceipt,
    closeReceipt,
    handlePayOrder,
  };
}
