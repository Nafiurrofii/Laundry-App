// ============================================================
// DataStore – in-memory mock store for TransactionWithRelations
// Mirrors the Supabase schema so the app is ready for real API calls.
// ============================================================

export type {
  UserRole,
  LaundryStatus,
  PaymentStatus,
  PaymentMethod,
  DbUser,
  DbCustomer,
  DbService,
  DbTransaction,
  DbStatusHistory,
  TransactionWithRelations,
} from './database.types';

export {
  LAUNDRY_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
} from './database.types';

// Re-export CashTransaction so existing cash-flow imports keep working
import { cashFlowStore, CashTransaction } from './cashFlowStore';
import { SupabaseService } from './supabaseService';
export type { CashTransaction };
export { cashFlowStore };

import type { TransactionWithRelations, LaundryStatus, PaymentStatus, PaymentMethod } from './database.types';

// ---- MOCK DATA ----

const INITIAL_ORDERS: TransactionWithRelations[] = [
  {
    transaction_id: 128,
    receipt_number: 'BLS-0128',
    customer_id: 1,
    service_id: 1,
    user_id: 'mock-user-uuid',
    weight_kg: 6,
    clothing_type: 'Pakaian Umum',
    price_per_kg: 8000,
    total_price: 48000,
    status: 'Processing',
    payment_status: 'Paid',
    payment_method: 'QRIS',
    amount_paid: 48000,
    received_at: '2026-10-08T09:20:00Z',
    completed_at: null,
    picked_up_at: null,
    paid_at: '2026-10-08T09:20:00Z',
    customer: { customer_id: 1, name: 'Aulia Putri', phone_number: '081234567801', address: null },
    service: { service_id: 1, service_name: 'Cuci Setrika', price_per_kg: 8000 },
    user: { user_id: 'mock-user-uuid', name: 'Admin', role: 'admin' },
  },
  {
    transaction_id: 127,
    receipt_number: 'BLS-0127',
    customer_id: 2,
    service_id: 2,
    user_id: 'mock-user-uuid',
    weight_kg: 4,
    clothing_type: 'Pakaian Umum',
    price_per_kg: 6000,
    total_price: 24000,
    status: 'Processing',
    payment_status: 'Unpaid',
    payment_method: null,
    amount_paid: 0,
    received_at: '2026-10-08T09:10:00Z',
    completed_at: null,
    picked_up_at: null,
    paid_at: null,
    customer: { customer_id: 2, name: 'Bima Pratama', phone_number: '081234567802', address: null },
    service: { service_id: 2, service_name: 'Cuci Kering', price_per_kg: 6000 },
    user: { user_id: 'mock-user-uuid', name: 'Admin', role: 'admin' },
  },
  {
    transaction_id: 126,
    receipt_number: 'BLS-0126',
    customer_id: 3,
    service_id: 3,
    user_id: 'mock-user-uuid',
    weight_kg: 5,
    clothing_type: 'Pakaian Umum',
    price_per_kg: 4000,
    total_price: 20000,
    status: 'Completed',
    payment_status: 'Paid',
    payment_method: 'QRIS',
    amount_paid: 20000,
    received_at: '2026-10-08T08:55:00Z',
    completed_at: '2026-10-08T15:00:00Z',
    picked_up_at: null,
    paid_at: '2026-10-08T08:55:00Z',
    customer: { customer_id: 3, name: 'Citra Lestari', phone_number: '081234567803', address: null },
    service: { service_id: 3, service_name: 'Cuci Basah', price_per_kg: 4000 },
    user: { user_id: 'mock-user-uuid', name: 'Admin', role: 'admin' },
  },
  {
    transaction_id: 125,
    receipt_number: 'BLS-0125',
    customer_id: 4,
    service_id: 1,
    user_id: 'mock-user-uuid',
    weight_kg: 8,
    clothing_type: 'Pakaian Kerja',
    price_per_kg: 8000,
    total_price: 64000,
    status: 'Completed',
    payment_status: 'Paid',
    payment_method: 'QRIS',
    amount_paid: 64000,
    received_at: '2026-10-08T08:45:00Z',
    completed_at: '2026-10-08T14:00:00Z',
    picked_up_at: null,
    paid_at: '2026-10-08T08:45:00Z',
    customer: { customer_id: 4, name: 'Dimas Saputra', phone_number: '081234567804', address: null },
    service: { service_id: 1, service_name: 'Cuci Setrika', price_per_kg: 8000 },
    user: { user_id: 'mock-user-uuid', name: 'Admin', role: 'admin' },
  },
  {
    transaction_id: 124,
    receipt_number: 'BLS-0124',
    customer_id: 5,
    service_id: 2,
    user_id: 'mock-user-uuid',
    weight_kg: 3,
    clothing_type: 'Pakaian Umum',
    price_per_kg: 6000,
    total_price: 18000,
    status: 'Received',
    payment_status: 'Unpaid',
    payment_method: null,
    amount_paid: 0,
    received_at: '2026-10-08T08:30:00Z',
    completed_at: null,
    picked_up_at: null,
    paid_at: null,
    customer: { customer_id: 5, name: 'Eka Wulandari', phone_number: '081234567805', address: null },
    service: { service_id: 2, service_name: 'Cuci Kering', price_per_kg: 6000 },
    user: { user_id: 'mock-user-uuid', name: 'Admin', role: 'admin' },
  },
  {
    transaction_id: 123,
    receipt_number: 'BLS-0123',
    customer_id: 6,
    service_id: 1,
    user_id: 'mock-user-uuid',
    weight_kg: 10,
    clothing_type: 'Pakaian Umum',
    price_per_kg: 8000,
    total_price: 80000,
    status: 'Picked Up',
    payment_status: 'Paid',
    payment_method: 'QRIS',
    amount_paid: 80000,
    received_at: '2026-10-08T08:15:00Z',
    completed_at: '2026-10-08T13:00:00Z',
    picked_up_at: '2026-10-08T16:00:00Z',
    paid_at: '2026-10-08T08:15:00Z',
    customer: { customer_id: 6, name: 'Farah Nabila', phone_number: '081234567806', address: null },
    service: { service_id: 1, service_name: 'Cuci Setrika', price_per_kg: 8000 },
    user: { user_id: 'mock-user-uuid', name: 'Admin', role: 'admin' },
  },
];

// ---- STORE CLASS ----

class DataStore {
  private orders: TransactionWithRelations[] = [...INITIAL_ORDERS];
  private listeners: (() => void)[] = [];
  private nextId = 129;
  private isSupabaseLive = false;
  private realtimeUnsub: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('laundryku_orders');
        if (saved) this.orders = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load orders from localStorage', e);
      }

      // Defer sinkronisasi ke microtask/next-tick agar proses loading bundle Webpack selesai dahulu
      setTimeout(() => {
        this.syncWithSupabase();
        try {
          this.realtimeUnsub = SupabaseService.subscribeToTransactions(() => {
            this.syncWithSupabase();
          });
        } catch (e) {
          console.warn('Realtime subscription not available:', e);
        }
      }, 0);
    }
  }

  public async syncWithSupabase(): Promise<boolean> {
    try {
      const { data, error } = await SupabaseService.fetchTransactions();
      if (!error && data) {
        if (data.length > 0) {
          this.orders = data;
          this.isSupabaseLive = true;
          this.notify();
          return true;
        } else {
          this.isSupabaseLive = true;
        }
      }
    } catch (err) {
      console.warn('Could not sync with Supabase (using local data):', err);
    }
    return false;
  }

  public isConnectedToSupabase(): boolean {
    return this.isSupabaseLive;
  }

  private notify() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('laundryku_orders', JSON.stringify(this.orders));
      } catch (e) {
        console.error('Failed to save orders to localStorage', e);
      }
    }
    this.listeners.forEach((l) => l());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getOrders(): TransactionWithRelations[] {
    return [...this.orders];
  }

  public getTransactions(): CashTransaction[] {
    return cashFlowStore.getTransactions();
  }

  public getOrderByReceiptNumber(receiptNumber: string): TransactionWithRelations | undefined {
    return this.orders.find(
      (o) => o.receipt_number.toLowerCase() === receiptNumber.toLowerCase().trim()
    );
  }

  public getOrderById(idOrReceipt: string | number): TransactionWithRelations | undefined {
    const query = String(idOrReceipt).toLowerCase().trim();
    return this.orders.find(
      (o) =>
        o.receipt_number.toLowerCase() === query ||
        String(o.transaction_id) === query
    );
  }

  public addOrder(
    orderData: Omit<TransactionWithRelations, 'transaction_id' | 'receipt_number' | 'received_at'>
  ): TransactionWithRelations {
    const id = this.nextId++;
    const receiptNumber = `BLS-0${id}`;
    const newOrder: TransactionWithRelations = {
      ...orderData,
      transaction_id: id,
      receipt_number: receiptNumber,
      received_at: new Date().toISOString(),
    };
    this.orders = [newOrder, ...this.orders];
    this.notify();

    // Simpan ke Supabase di background
    SupabaseService.createTransaction({
      customerName: orderData.customer?.name || 'Pelanggan',
      customerPhone: orderData.customer?.phone_number || '',
      customerAddress: orderData.customer?.address || null,
      serviceId: orderData.service?.service_id,
      serviceName: orderData.service?.service_name,
      weightKg: orderData.weight_kg,
      clothingType: orderData.clothing_type,
      isPaid: orderData.payment_status === 'Paid',
      paymentMethod: orderData.payment_method,
      userId: orderData.user_id,
    })
      .then((res) => {
        if (res.data) {
          // Ganti data sementara dengan data yang terverifikasi dari Supabase
          const idx = this.orders.findIndex((o) => o.receipt_number === receiptNumber);
          if (idx !== -1) {
            this.orders[idx] = res.data;
            this.notify();
          }
        }
      })
      .catch((err) => {
        console.warn('Background Supabase insert error:', err);
      });

    return newOrder;
  }

  public updateOrderStatus(receiptNumber: string, newStatus: LaundryStatus): boolean {
    const idx = this.orders.findIndex((o) => o.receipt_number === receiptNumber);
    if (idx === -1) return false;

    this.orders[idx] = {
      ...this.orders[idx],
      status: newStatus,
      completed_at:
        newStatus === 'Completed' && !this.orders[idx].completed_at
          ? new Date().toISOString()
          : this.orders[idx].completed_at,
      picked_up_at:
        newStatus === 'Picked Up' && !this.orders[idx].picked_up_at
          ? new Date().toISOString()
          : this.orders[idx].picked_up_at,
    };
    this.notify();

    // Update status di Supabase
    SupabaseService.updateOrderStatus(receiptNumber, newStatus).catch((err) => {
      console.warn('Background Supabase status update error:', err);
    });

    return true;
  }

  public updateOrderPayment(
    receiptNumber: string,
    paymentMethod: PaymentMethod,
    amountPaid: number
  ): boolean {
    const idx = this.orders.findIndex((o) => o.receipt_number === receiptNumber);
    if (idx === -1) return false;

    const order = this.orders[idx];
    const newAmountPaid = order.amount_paid + amountPaid;
    const newPaymentStatus: PaymentStatus =
      newAmountPaid >= order.total_price
        ? 'Paid'
        : newAmountPaid > 0
          ? 'Partially Paid'
          : 'Unpaid';

    this.orders[idx] = {
      ...order,
      payment_status: newPaymentStatus,
      payment_method: paymentMethod,
      amount_paid: Math.min(newAmountPaid, order.total_price),
      paid_at: newPaymentStatus === 'Paid' ? new Date().toISOString() : order.paid_at,
    };
    this.notify();

    // Update pembayaran di Supabase
    SupabaseService.updateOrderPayment(receiptNumber, paymentMethod, amountPaid).catch((err) => {
      console.warn('Background Supabase payment update error:', err);
    });

    return true;
  }
}

export const dataStore = new DataStore();

// Backward-compat alias so existing imports of `LaundryOrder` keep working
export type LaundryOrder = TransactionWithRelations;
