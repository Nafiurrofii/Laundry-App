'use client';

import { useState } from 'react';
import { LandingService } from '../service/landingService';
import { LandingMutations } from '../mutations/landingMutations';
import { LaundryOrder } from '@/lib/dataStore';

export function useLandingViewModel() {
  const [services] = useState(() => LandingService.getServicePlans());
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingResult, setTrackingResult] = useState<LaundryOrder | null>(null);
  const [trackingNotFound, setTrackingNotFound] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const handleOpenTracking = (initialQuery?: string) => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
    setIsTrackingModalOpen(true);
  };

  const handleCloseTracking = () => {
    setIsTrackingModalOpen(false);
    setTrackingResult(null);
    setTrackingNotFound(false);
  };

  const handleSearch = async (queryToSearch?: string) => {
    const q = queryToSearch !== undefined ? queryToSearch : searchQuery;
    if (!q.trim()) return;

    const res = await LandingMutations.searchTracking(q);
    if (res) {
      setTrackingResult(res);
      setTrackingNotFound(false);
    } else {
      setTrackingResult(null);
      setTrackingNotFound(true);
    }
  };

  return {
    services,
    searchQuery,
    setSearchQuery,
    trackingResult,
    trackingNotFound,
    isTrackingModalOpen,
    handleOpenTracking,
    handleCloseTracking,
    handleSearch,
  };
}
