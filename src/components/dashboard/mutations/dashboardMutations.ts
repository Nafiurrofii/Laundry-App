import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { CreateOrderInput } from '../types';

export class DashboardMutations {
  /**
   * Menambahkan pesanan baru ke sistem
   */
  public static createOrder(input: CreateOrderInput): LaundryOrder {
    const priceMap: Record<CreateOrderInput['service'], number> = {
      'Cuci Setrika': 8000,
      'Cuci Kering': 6000,
      'Cuci Basah': 4000,
    };

    const pricePerKg = priceMap[input.service] || 8000;
    const totalPrice = input.weight * pricePerKg;
    const paidAmount = input.isPaid ? totalPrice : 0;

    return dataStore.addOrder({
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      service: input.service,
      weight: input.weight,
      pricePerKg,
      totalPrice,
      paidAmount,
      isPaid: input.isPaid,
      paymentMethod: input.isPaid ? input.paymentMethod || 'QRIS' : undefined,
      status: 'Diterima',
    });
  }

  /**
   * Mengubah status operasional pesanan
   */
  public static updateStatus(id: string, newStatus: LaundryOrder['status']): boolean {
    return dataStore.updateOrderStatus(id, newStatus);
  }
}
