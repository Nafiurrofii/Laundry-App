import { dataStore } from '@/lib/dataStore';
import { SupabaseService } from '@/lib/supabaseService';
import type { TransactionWithRelations } from '@/lib/database.types';
import { DataCucianStats, ServiceSummaryItem, StatusFilterTab } from '../types';

export class DataCucianService {
  public static getAllOrders(): TransactionWithRelations[] {
    return dataStore.getOrders();
  }

  /**
   * Mengambil data pesanan langsung dari database Supabase dan menyinkronkannya
   */
  public static async fetchAllFromDatabase(): Promise<TransactionWithRelations[]> {
    try {
      const { data, error } = await SupabaseService.fetchTransactions();
      if (!error && data && data.length > 0) {
        await dataStore.syncWithSupabase();
        return data;
      }
    } catch (e) {
      console.warn('Gagal memuat data dari Supabase, menggunakan data lokal:', e);
    }
    return dataStore.getOrders();
  }

  public static getStats(orders: TransactionWithRelations[]): DataCucianStats {
    const totalWeight = orders.reduce((sum, o) => sum + (o.weight_kg || 0), 0);
    const inProgress = orders.filter((o) =>
      ['Received', 'Processing'].includes(o.status)
    ).length;
    const readyPickup = orders.filter((o) => o.status === 'Completed').length;

    return {
      totalOrders: orders.length,
      totalWeight,
      inProgressCount: inProgress,
      readyPickupCount: readyPickup,
    };
  }

  public static getServiceSummaries(orders: TransactionWithRelations[]): ServiceSummaryItem[] {
    const services = ['Cuci Setrika', 'Cuci Kering', 'Cuci Basah'];

    return services.map((svc) => {
      const matching = orders.filter((o) => o.service?.service_name === svc);
      const totalWeight = matching.reduce((sum, o) => sum + (o.weight_kg || 0), 0);
      const totalAmount = matching.reduce((sum, o) => sum + (o.total_price || 0), 0);

      return {
        serviceName: svc,
        orderCount: matching.length,
        totalWeight,
        totalAmount,
      };
    });
  }

  public static filterOrders(
    orders: TransactionWithRelations[],
    searchQuery: string,
    selectedService: string,
    activeTab: StatusFilterTab
  ): TransactionWithRelations[] {
    return orders.filter((order) => {
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = order.customer?.name?.toLowerCase().includes(q);
        const matchesReceipt = order.receipt_number?.toLowerCase().includes(q);
        if (!matchesName && !matchesReceipt) return false;
      }

      // Filter by service dropdown
      if (selectedService && selectedService !== 'Semua layanan') {
        if (order.service?.service_name !== selectedService) return false;
      }

      // Filter by status tab (DB enum values)
      if (activeTab === 'dalam_proses') {
        return ['Received', 'Processing'].includes(order.status);
      }
      if (activeTab === 'siap_diambil') {
        return order.status === 'Completed';
      }
      if (activeTab === 'selesai') {
        return order.status === 'Picked Up';
      }

      return true; // 'semua'
    });
  }
}


