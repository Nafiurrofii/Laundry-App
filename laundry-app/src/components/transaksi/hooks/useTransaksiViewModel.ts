'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataStore } from '@/lib/dataStore';
import type { TransactionWithRelations } from '@/lib/database.types';
import { TransaksiService } from '../service/transaksiService';
import { TransaksiMutations } from '../mutations/transaksiMutations';
import { TransaksiFilter } from '../types';
import type { PaymentMethod } from '@/lib/database.types';

export function useTransaksiViewModel() {
  const [orders, setOrders] = useState<TransactionWithRelations[]>([]);
  const [filter, setFilter] = useState<TransaksiFilter>({
    search: '',
    paymentStatus: 'semua',
  });
  const [selectedOrder, setSelectedOrder] = useState<TransactionWithRelations | null>(null);
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

  const viewReceipt = (order: TransactionWithRelations) => {
    setSelectedOrder(order);
    setIsReceiptModalOpen(true);
  };

  const closeReceipt = () => {
    setSelectedOrder(null);
    setIsReceiptModalOpen(false);
  };

  const handlePayOrder = (receiptNumber: string, method: PaymentMethod) => {
    TransaksiMutations.markAsPaid(receiptNumber, method);
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

