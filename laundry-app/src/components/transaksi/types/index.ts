import { LaundryOrder } from '@/lib/dataStore';

export interface TransaksiFilter {
  search: string;
  paymentStatus: 'semua' | 'lunas' | 'belum_lunas';
}

export interface TransaksiViewModelState {
  orders: LaundryOrder[];
  filteredOrders: LaundryOrder[];
  filter: TransaksiFilter;
  selectedOrder: LaundryOrder | null;
  isReceiptModalOpen: boolean;
}
