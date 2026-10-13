'use client';

import { useState, useEffect, useCallback } from 'react';
import { dataStore } from '@/lib/dataStore';
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
    const unsubscribe = dataStore.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const handleDownloadPDF = () => {
    LaporanMutations.downloadPDF();
  };

  return {
    state,
    handleDownloadPDF,
  };
}
