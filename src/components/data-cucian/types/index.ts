import { LaundryOrder } from '@/lib/dataStore';

export type StatusFilterTab = 'semua' | 'dalam_proses' | 'siap_diambil' | 'selesai';

export interface DataCucianStats {
  totalOrders: number;
  totalWeight: number;
  inProgressCount: number;
  readyPickupCount: number;
}

export interface ServiceSummaryItem {
  serviceName: string;
  orderCount: number;
  totalWeight: number;
  totalAmount: number;
}

export interface DataCucianViewModelState {
  orders: LaundryOrder[];
  filteredOrders: LaundryOrder[];
  stats: DataCucianStats;
  serviceSummaries: ServiceSummaryItem[];
  searchQuery: string;
  selectedService: string;
  activeTab: StatusFilterTab;
  tabCounts: {
    semua: number;
    dalam_proses: number;
    siap_diambil: number;
    selesai: number;
  };
  isAddModalOpen: boolean;
}
