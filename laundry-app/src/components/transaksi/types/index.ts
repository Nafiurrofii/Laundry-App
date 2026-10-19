import type { TransactionWithRelations } from '@/lib/database.types';

export interface TransaksiFilter {
  search: string;
  paymentStatus: 'semua' | 'lunas' | 'belum_lunas';
}

export interface TransaksiViewModelState {
  orders: TransactionWithRelations[];
  filteredOrders: TransactionWithRelations[];
  filter: TransaksiFilter;
  selectedOrder: TransactionWithRelations | null;
  isReceiptModalOpen: boolean;
}

