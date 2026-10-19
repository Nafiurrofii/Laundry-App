'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { dataStore } from '@/lib/dataStore';
import { PrediksiService } from '../service/prediksiService';
import { PrediksiMutations } from '../mutations/prediksiMutations';
import {
  PredictionInput,
  ServiceTypeOption,
  FragranceIntensity,
  MLPredictionState,
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

  // ── ML API State ──────────────────────────────────────────────
  const [mlState, setMlState] = useState<MLPredictionState>({
    isLoading: false,
    error: null,
    prediksi: null,
    lastFetchedAt: null,
  });

  /** true setelah user pertama kali klik tombol Hitung */
  const [hasCalculated, setHasCalculated] = useState(false);

  /** snapshot input yang digunakan saat tombol Hitung terakhir diklik */
  const [committedInput, setCommittedInput] = useState<PredictionInput | null>(null);

  // ── Sinkronisasi berat cucian hari ini ────────────────────────
  const refreshTodayWeight = useCallback(() => {
    const w = PrediksiService.getTodayActiveWeight();
    setTodayWeight(w);
  }, []);

  useEffect(() => {
    refreshTodayWeight();
    const unsubscribe = dataStore.subscribe(refreshTodayWeight);
    return () => unsubscribe();
  }, [refreshTodayWeight]);

  // ── Panggil Python API ────────────────────────────────────────
  const fetchMLPrediction = useCallback(async (kg: number) => {
    if (kg <= 0) return;

    setMlState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await fetch('/api/prediksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kg }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMlState({
        isLoading: false,
        error: null,
        prediksi: data.prediksi as Record<string, number>,
        lastFetchedAt: new Date(),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghubungi Python API';
      setMlState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  // ── Kalkulasi (rule-based) — hanya dihitung dari committedInput ─
  const results = useMemo(() => {
    if (!committedInput) return [];
    return PrediksiService.calculatePrediction(committedInput);
  }, [committedInput]);

  const inventory = useMemo(() => {
    return PrediksiService.getInventory();
  }, []);

  const totalEstimatedCost = useMemo(() => {
    return results.reduce((sum, item) => sum + item.estimatedCost, 0);
  }, [results]);

  const hasInsufficientStock = useMemo(() => {
    return results.some((item) => !item.isSufficient && item.totalNeeded > 0);
  }, [results]);

  // ── Handler input ─────────────────────────────────────────────
  const handleWeightChange = (val: number) => {
    const valid = PrediksiMutations.validateWeight(val);
    setInput((prev) => ({ ...prev, weightKg: valid }));
  };

  const handleServiceChange = (service: ServiceTypeOption) => {
    setInput((prev) => ({ ...prev, serviceType: service }));
  };

  const handleIntensityChange = (intensity: FragranceIntensity) => {
    setInput((prev) => ({ ...prev, intensity }));
  };

  const handleVariantChange = (fragranceVariant: string) => {
    setInput((prev) => ({ ...prev, fragranceVariant }));
  };

  const applyPresetWeight = (kg: number) => {
    setInput((prev) => ({ ...prev, weightKg: kg }));
  };

  /**
   * Tombol "Hitung Prediksi" — commit input lalu panggil API ML.
   * Hasil rule-based juga baru muncul setelah ini diklik.
   */
  const handleHitung = () => {
    setHasCalculated(true);
    setCommittedInput({ ...input });
    fetchMLPrediction(input.weightKg);
  };

  /** Refresh ulang ML tanpa mengubah input */
  const retryMLPrediction = () => {
    fetchMLPrediction(input.weightKg);
  };

  return {
    input,
    results,
    inventory,
    todayWeight,
    totalEstimatedCost,
    hasInsufficientStock,
    hasCalculated,
    committedInput,
    // ML
    mlState,
    retryMLPrediction,
    handleHitung,
    // Handlers
    handleWeightChange,
    handleServiceChange,
    handleIntensityChange,
    handleVariantChange,
    applyPresetWeight,
  };
}
