import { dataStore, LaundryOrder } from '@/lib/dataStore';

export class DataCucianMutations {
  public static updateStatus(id: string, newStatus: LaundryOrder['status']): boolean {
    return dataStore.updateOrderStatus(id, newStatus);
  }

  public static createOrder(data: {
    customerName: string;
    customerPhone?: string;
    service: 'Cuci Setrika' | 'Cuci Kering' | 'Cuci Basah';
    weight: number;
    isPaid: boolean;
    paymentMethod?: 'QRIS' | 'Tunai';
  }): LaundryOrder {
    const priceMap = {
      'Cuci Setrika': 8000,
      'Cuci Kering': 6000,
      'Cuci Basah': 4000,
    };
    const pricePerKg = priceMap[data.service] || 8000;
    const totalPrice = data.weight * pricePerKg;

    return dataStore.addOrder({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      service: data.service,
      weight: data.weight,
      pricePerKg,
      totalPrice,
      paidAmount: data.isPaid ? totalPrice : 0,
      isPaid: data.isPaid,
      paymentMethod: data.isPaid ? data.paymentMethod || 'QRIS' : undefined,
      status: 'Diterima',
    });
  }
}
