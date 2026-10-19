import { dataStore, LaundryOrder } from '@/lib/dataStore';
import type { PaymentStatus, PaymentMethod } from '@/lib/database.types';
import { CreateOrderInput } from '../types';

export class DashboardMutations {
  /**
   * Menambahkan pesanan baru ke sistem
   */
  public static createOrder(input: CreateOrderInput): LaundryOrder {
    const serviceMap: Record<
      CreateOrderInput['service'],
      { id: number; price: number }
    > = {
      'Cuci Setrika': { id: 1, price: 8000 },
      'Cuci Kering': { id: 2, price: 6000 },
      'Cuci Basah': { id: 3, price: 4000 },
    };

    const svc = serviceMap[input.service] || { id: 1, price: 8000 };
    const pricePerKg = svc.price;
    const totalPrice = input.weight * pricePerKg;
    const isPaid = input.isPaid;
    const amountPaid = isPaid ? totalPrice : 0;
    const paymentStatus: PaymentStatus = isPaid ? 'Paid' : 'Unpaid';
    const paymentMethod: PaymentMethod | null = isPaid
      ? input.paymentMethod === 'Tunai'
        ? 'Cash'
        : 'QRIS'
      : null;

    return dataStore.addOrder({
      customer_id: Date.now(),
      service_id: svc.id,
      user_id: 'mock-user-uuid',
      weight_kg: input.weight,
      clothing_type: 'Pakaian Umum',
      price_per_kg: pricePerKg,
      total_price: totalPrice,
      status: 'Received',
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      amount_paid: amountPaid,
      completed_at: null,
      picked_up_at: null,
      paid_at: isPaid ? new Date().toISOString() : null,
      customer: {
        customer_id: Date.now(),
        name: input.customerName,
        phone_number: input.customerPhone || '',
        address: null,
      },
      service: {
        service_id: svc.id,
        service_name: input.service,
        price_per_kg: pricePerKg,
      },
      user: {
        user_id: 'mock-user-uuid',
        name: 'Admin',
        role: 'admin',
      },
    });
  }

  /**
   * Mengubah status operasional pesanan
   */
  public static updateStatus(id: string, newStatus: LaundryOrder['status']): boolean {
    return dataStore.updateOrderStatus(id, newStatus);
  }
}

