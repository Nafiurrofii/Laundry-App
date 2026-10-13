import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { TransaksiFilter } from '../types';

export class TransaksiService {
  public static getAllTransactions(): LaundryOrder[] {
    return dataStore.getOrders();
  }

  public static filterTransactions(
    orders: LaundryOrder[],
    filter: TransaksiFilter
  ): LaundryOrder[] {
    return orders.filter((o) => {
      if (filter.search.trim()) {
        const q = filter.search.toLowerCase().trim();
        const matchesName = o.customerName.toLowerCase().includes(q);
        const matchesId = o.id.toLowerCase().includes(q);
        if (!matchesName && !matchesId) return false;
      }

      if (filter.paymentStatus === 'lunas' && !o.isPaid) return false;
      if (filter.paymentStatus === 'belum_lunas' && o.isPaid) return false;

      return true;
    });
  }
}
