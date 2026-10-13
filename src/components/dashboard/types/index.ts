import { LaundryOrder } from '@/lib/dataStore';

export interface DashboardMetrics {
  todayOrdersCount: number;
  pendingPickupCount: number;
  totalWeight: number;
  serviceTypesCount: number;
  incomingPayment: number;
  paidOrdersCount: number;
  readyPickupCount: number;
  readyPickupCustomers: string[];
}

export interface RevenueTrendItem {
  dateLabel: string;
  amountThousand: number;
  isToday?: boolean;
}

export interface OperationalStatusCounts {
  diterima: number;
  dicuci: number;
  disetrika: number;
  siapDiambil: number;
  selesai: number;
  total: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone?: string;
  service: 'Cuci Setrika' | 'Cuci Kering' | 'Cuci Basah';
  weight: number;
  isPaid: boolean;
  paymentMethod?: 'QRIS' | 'Tunai';
}

export interface DashboardViewModelState {
  metrics: DashboardMetrics;
  revenueTrend: RevenueTrendItem[];
  total7DaysRevenue: number;
  operationalStatus: OperationalStatusCounts;
  recentOrders: LaundryOrder[];
  isAddModalOpen: boolean;
  selectedDate: string;
}
