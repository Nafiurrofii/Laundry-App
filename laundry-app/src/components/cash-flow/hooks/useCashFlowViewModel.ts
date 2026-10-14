'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataStore, CashTransaction } from '@/lib/dataStore';
import { CashFlowService } from '../service/cashFlowService';
import { CashFlowMutations } from '../mutations/cashFlowMutations';
import { CashFlowTab, CreateExpenseInput } from '../types';

export function useCashFlowViewModel() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<CashFlowTab>('semua');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const refresh = useCallback(() => {
    setTransactions(dataStore.getTransactions());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = dataStore.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const summary = useMemo(
    () => CashFlowService.getSummary(transactions),
    [transactions]
  );

  const expenseComposition = useMemo(
    () => CashFlowService.getExpenseComposition(transactions),
    [transactions]
  );

  const tabCounts = useMemo(() => {
    return {
      semua: transactions.length,
      masuk: transactions.filter((t) => t.type === 'Kas masuk').length,
      keluar: transactions.filter((t) => t.type === 'Kas keluar').length,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(
    () => CashFlowService.filterTransactions(transactions, activeTab),
    [transactions, activeTab]
  );

  const handleAddExpense = (input: CreateExpenseInput) => {
    CashFlowMutations.addExpense(input);
    setIsAddExpenseModalOpen(false);
  };

  const handleExportCSV = () => {
    CashFlowMutations.exportToCSV(filteredTransactions);
  };

  return {
    transactions,
    filteredTransactions,
    summary,
    expenseComposition,
    activeTab,
    setActiveTab,
    tabCounts,
    isAddExpenseModalOpen,
    openAddExpenseModal: () => setIsAddExpenseModalOpen(true),
    closeAddExpenseModal: () => setIsAddExpenseModalOpen(false),
    handleAddExpense,
    handleExportCSV,
  };
}
