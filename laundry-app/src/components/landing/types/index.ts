import { LaundryOrder } from '@/lib/dataStore';

export interface ServicePricePlan {
  id: string;
  name: string;
  pricePerKg: number;
  description: string;
  features: string[];
  duration: string;
  iconType: 'kering' | 'setrika' | 'basah';
}

export interface LandingViewModelState {
  services: ServicePricePlan[];
  searchQuery: string;
  trackingResult: LaundryOrder | null;
  trackingNotFound: boolean;
  isTrackingModalOpen: boolean;
}
