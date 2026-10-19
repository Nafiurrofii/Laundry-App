'use client';

import { useState, useEffect, useCallback } from 'react';
import { dataStore, cashFlowStore } from '@/lib/dataStore';
import { LaporanService } from '../service/laporanService';
import { LaporanMutations } from '../mutations/laporanMutations';
import { LaporanViewModelState } from '../types';

export function useLaporanViewModel() {
  const [state, setState] = useState<LaporanViewModelState>(() =>
    LaporanService.getReportData()
  );

  const refresh = useCallback(() => {
    setState(LaporanService.getReportData());
  }, []);

  useEffect(() => {
    const unsubOrders = dataStore.subscribe(refresh);
    const unsubCash = cashFlowStore.subscribe(refresh);
    return () => {
      unsubOrders();
      unsubCash();
    };
  }, [refresh]);

  const handleDownloadPDF = () => {
    LaporanMutations.downloadPDF();
  };

  return {
    state,
    handleDownloadPDF,
  };
}
