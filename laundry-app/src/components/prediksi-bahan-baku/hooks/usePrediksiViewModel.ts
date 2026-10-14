'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { dataStore } from '@/lib/dataStore';
import { PrediksiService } from '../service/prediksiService';
import { PrediksiMutations } from '../mutations/prediksiMutations';
import {
  PredictionInput,
  ServiceTypeOption,
  FragranceIntensity,
} from '../types';

export function usePrediksiViewModel() {
  const [todayWeight, setTodayWeight] = useState<number>(() =>
    PrediksiService.getTodayActiveWeight()
  );

  const [input, setInput] = useState<PredictionInput>({
    weightKg: 36, // default: berat cucian hari ini
    serviceType: 'Cuci Setrika',
    intensity: 'Standar',
    fragranceVariant: 'Snappy Fresh',
  });

  const refreshTodayWeight = useCallback(() => {
    const w = PrediksiService.getTodayActiveWeight();
    setTodayWeight(w);
  }, []);

  useEffect(() => {
    refreshTodayWeight();
    const unsubscribe = dataStore.subscribe(refreshTodayWeight);
    return () => unsubscribe();
  }, [refreshTodayWeight]);

  // Hasil kalkulasi prediksi bahan baku (sabun ml, parfum ml, softener ml, plastik)
  const results = useMemo(() => {
    return PrediksiService.calculatePrediction(input);
  }, [input]);

  const inventory = useMemo(() => {
    return PrediksiService.getInventory();
  }, []);

  // Total estimasi biaya bahan baku
  const totalEstimatedCost = useMemo(() => {
    return results.reduce((sum, item) => sum + item.estimatedCost, 0);
  }, [results]);

  // Cek apakah ada bahan yang stoknya kurang
  const hasInsufficientStock = useMemo(() => {
    return results.some((item) => !item.isSufficient && item.totalNeeded > 0);
  }, [results]);

  // Handler input berat
  const handleWeightChange = (val: number) => {
    const valid = PrediksiMutations.validateWeight(val);
    setInput((prev) => ({ ...prev, weightKg: valid }));
  };

  // Handler jenis layanan
  const handleServiceChange = (service: ServiceTypeOption) => {
    setInput((prev) => ({ ...prev, serviceType: service }));
  };

  // Handler intensitas wangi
  const handleIntensityChange = (intensity: FragranceIntensity) => {
    setInput((prev) => ({ ...prev, intensity }));
  };

  // Handler varian aroma
  const handleVariantChange = (fragranceVariant: string) => {
    setInput((prev) => ({ ...prev, fragranceVariant }));
  };

  // Preset berat
  const applyPresetWeight = (kg: number) => {
    setInput((prev) => ({ ...prev, weightKg: kg }));
  };

  return {
    input,
    results,
    inventory,
    todayWeight,
    totalEstimatedCost,
    hasInsufficientStock,
    handleWeightChange,
    handleServiceChange,
    handleIntensityChange,
    handleVariantChange,
    applyPresetWeight,
  };
}
