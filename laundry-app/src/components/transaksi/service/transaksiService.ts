import { dataStore } from '@/lib/dataStore';
import type { TransactionWithRelations } from '@/lib/database.types';
import { TransaksiFilter } from '../types';

export class TransaksiService {
  public static getAllTransactions(): TransactionWithRelations[] {
    return dataStore.getOrders();
  }

  public static filterTransactions(
    orders: TransactionWithRelations[],
    filter: TransaksiFilter
  ): TransactionWithRelations[] {
    return orders.filter((o) => {
      if (filter.search.trim()) {
        const q = filter.search.toLowerCase().trim();
        const matchesName = o.customer.name.toLowerCase().includes(q);
        const matchesReceipt = o.receipt_number.toLowerCase().includes(q);
        if (!matchesName && !matchesReceipt) return false;
      }

      if (filter.paymentStatus === 'lunas' && o.payment_status !== 'Paid') return false;
      if (filter.paymentStatus === 'belum_lunas' && o.payment_status === 'Paid') return false;

      return true;
    });
  }
}

