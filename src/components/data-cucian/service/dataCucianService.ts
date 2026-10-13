import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { DataCucianStats, ServiceSummaryItem, StatusFilterTab } from '../types';

export class DataCucianService {
  public static getAllOrders(): LaundryOrder[] {
    return dataStore.getOrders();
  }

  public static getStats(orders: LaundryOrder[]): DataCucianStats {
    const totalWeight = orders.reduce((sum, o) => sum + o.weight, 0);
    const inProgress = orders.filter((o) =>
      ['Diterima', 'Dicuci', 'Disetrika'].includes(o.status)
    ).length;
    const readyPickup = orders.filter((o) => o.status === 'Siap diambil').length;

    return {
      totalOrders: orders.length,
      totalWeight,
      inProgressCount: inProgress,
      readyPickupCount: readyPickup,
    };
  }

  public static getServiceSummaries(orders: LaundryOrder[]): ServiceSummaryItem[] {
    const services = ['Cuci Kering', 'Cuci Setrika', 'Cuci Basah'];

    return services.map((svc) => {
      const matching = orders.filter((o) => o.service === svc);
      const totalWeight = matching.reduce((sum, o) => sum + o.weight, 0);
      const totalAmount = matching.reduce((sum, o) => sum + o.totalPrice, 0);

      return {
        serviceName: svc,
        orderCount: matching.length,
        totalWeight,
        totalAmount,
      };
    });
  }

  public static filterOrders(
    orders: LaundryOrder[],
    searchQuery: string,
    selectedService: string,
    activeTab: StatusFilterTab
  ): LaundryOrder[] {
    return orders.filter((order) => {
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesId = order.id.toLowerCase().includes(q);
        if (!matchesName && !matchesId) return false;
      }

      // Filter by service dropdown
      if (selectedService && selectedService !== 'Semua layanan') {
        if (order.service !== selectedService) return false;
      }

      // Filter by status tab
      if (activeTab === 'dalam_proses') {
        return ['Diterima', 'Dicuci', 'Disetrika'].includes(order.status);
      }
      if (activeTab === 'siap_diambil') {
        return order.status === 'Siap diambil';
      }
      if (activeTab === 'selesai') {
        return order.status === 'Selesai';
      }

      return true;
    });
  }
}
