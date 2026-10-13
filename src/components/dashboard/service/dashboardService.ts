import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { DashboardMetrics, OperationalStatusCounts, RevenueTrendItem } from '../types';

export class DashboardService {
  /**
   * Mengambil metrik utama untuk ringkasan operasional hari ini
   */
  public static getMetrics(): DashboardMetrics {
    const orders = dataStore.getOrders();
    const readyOrders = orders.filter((o) => o.status === 'Siap diambil');
    const readyCustomers = Array.from(new Set(readyOrders.map((o) => o.customerName)));

    const totalWeight = orders.reduce((sum, o) => sum + o.weight, 0);
    const serviceSet = new Set(orders.map((o) => o.service));
    const paidOrders = orders.filter((o) => o.isPaid);
    const incomingPayment = paidOrders.reduce((sum, o) => sum + o.paidAmount, 0);

    return {
      todayOrdersCount: orders.length,
      pendingPickupCount: orders.filter((o) => o.status !== 'Selesai').length,
      totalWeight,
      serviceTypesCount: serviceSet.size || 3,
      incomingPayment,
      paidOrdersCount: paidOrders.length,
      readyPickupCount: readyOrders.length,
      readyPickupCustomers: readyCustomers,
    };
  }

  /**
   * Mengambil tren penerimaan 7 hari terakhir
   */
  public static getRevenueTrend(): RevenueTrendItem[] {
    return [
      { dateLabel: '2 Okt', amountThousand: 180 },
      { dateLabel: '3 Okt', amountThousand: 210 },
      { dateLabel: '4 Okt', amountThousand: 195 },
      { dateLabel: '5 Okt', amountThousand: 225 },
      { dateLabel: '6 Okt', amountThousand: 240 },
      { dateLabel: '7 Okt', amountThousand: 218 },
      { dateLabel: '8 Okt', amountThousand: 212, isToday: true },
    ];
  }

  /**
   * Menghitung total pendapatan 7 hari
   */
  public static getTotal7DaysRevenue(): number {
    return 1480000;
  }

  /**
   * Mengambil rincian status operasional hari ini
   */
  public static getOperationalStatus(): OperationalStatusCounts {
    const orders = dataStore.getOrders();
    return {
      diterima: orders.filter((o) => o.status === 'Diterima').length,
      dicuci: orders.filter((o) => o.status === 'Dicuci').length,
      disetrika: orders.filter((o) => o.status === 'Disetrika').length,
      siapDiambil: orders.filter((o) => o.status === 'Siap diambil').length,
      selesai: orders.filter((o) => o.status === 'Selesai').length,
      total: orders.length,
    };
  }

  /**
   * Mengambil pesanan terbaru untuk tabel ringkasan
   */
  public static getRecentOrders(limit: number = 3): LaundryOrder[] {
    return dataStore.getOrders().slice(0, limit);
  }
}
