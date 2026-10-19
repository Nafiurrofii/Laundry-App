import { dataStore } from '@/lib/dataStore';
import { SupabaseService } from '@/lib/supabaseService';
import type { LaundryStatus, PaymentMethod } from '@/lib/database.types';

// Mapping nama layanan → service_id & price_per_kg
const SERVICE_MAP: Record<
  string,
  { service_id: number; service_name: string; price_per_kg: number }
> = {
  'Cuci Setrika': { service_id: 1, service_name: 'Cuci Setrika', price_per_kg: 8000 },
  'Cuci Kering': { service_id: 2, service_name: 'Cuci Kering', price_per_kg: 6000 },
  'Cuci Basah': { service_id: 3, service_name: 'Cuci Basah', price_per_kg: 4000 },
};

export class DataCucianMutations {
  /**
   * Mengubah status pesanan dan menyimpannya langsung ke database Supabase
   */
  public static async updateStatus(receiptNumber: string, newStatus: LaundryStatus): Promise<boolean> {
    // 1. Optimistic update di store lokal agar UI seketika berubah
    dataStore.updateOrderStatus(receiptNumber, newStatus);

    // 2. Simpan perubahan ke Supabase
    try {
      const res = await SupabaseService.updateOrderStatus(receiptNumber, newStatus);
      return res.success;
    } catch (e) {
      console.warn('Gagal memperbarui status ke Supabase:', e);
      return false;
    }
  }

  /**
   * Menambahkan pesanan baru langsung ke tabel transactions di Supabase
   */
  public static async createOrder(data: {
    customerName: string;
    customerPhone?: string;
    service: string;
    weight: number;
    isPaid: boolean;
    paymentMethod?: any;
  }) {
    const svc = SERVICE_MAP[data.service] ?? SERVICE_MAP['Cuci Setrika'];
    const totalPrice = data.weight * svc.price_per_kg;
    const paymentStatus = data.isPaid ? 'Paid' : 'Unpaid';
    const paymentMethod: PaymentMethod | null = data.isPaid
      ? (data.paymentMethod === 'Tunai' ? 'Cash' : data.paymentMethod ?? 'Cash')
      : null;

    // 1. Optimistic update lokal
    const localOrder = dataStore.addOrder({
      customer_id: 0,
      service_id: svc.service_id,
      user_id: 'mock-user-uuid',
      weight_kg: data.weight,
      clothing_type: 'Pakaian Umum',
      price_per_kg: svc.price_per_kg,
      total_price: totalPrice,
      status: 'Received' as LaundryStatus,
      payment_status: paymentStatus as 'Paid' | 'Unpaid',
      payment_method: paymentMethod,
      amount_paid: data.isPaid ? totalPrice : 0,
      completed_at: null,
      picked_up_at: null,
      paid_at: data.isPaid ? new Date().toISOString() : null,
      customer: {
        customer_id: 0,
        name: data.customerName,
        phone_number: data.customerPhone ?? '',
        address: null,
      },
      service: svc,
      user: { user_id: 'mock-user-uuid', name: 'Admin', role: 'admin' },
    });

    // 2. Simpan ke database Supabase
    try {
      const { data: dbOrder, error } = await SupabaseService.createTransaction({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        serviceId: svc.service_id,
        serviceName: svc.service_name,
        weightKg: data.weight,
        isPaid: data.isPaid,
        paymentMethod: paymentMethod,
      });

      if (!error && dbOrder) {
        await dataStore.syncWithSupabase();
        return dbOrder;
      }
    } catch (err) {
      console.warn('Gagal menyimpan pesanan ke Supabase:', err);
    }

    return localOrder;
  }
}


