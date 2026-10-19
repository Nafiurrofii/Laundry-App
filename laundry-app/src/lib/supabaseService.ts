import { supabase } from './supabase';
import type {
  TransactionWithRelations,
  LaundryStatus,
  PaymentStatus,
  PaymentMethod,
  DbCustomer,
  DbService,
  DbUser,
} from './database.types';

export interface CreateTransactionParams {
  customerName: string;
  customerPhone?: string;
  customerAddress?: string | null;
  serviceId?: number;
  serviceName?: string;
  weightKg: number;
  clothingType?: string;
  isPaid?: boolean;
  paymentMethod?: PaymentMethod | null;
  userId?: string;
}

export class SupabaseService {
  /**
   * Mengambil semua pesanan / transaksi lengkap dengan relasi customer, service, dan user.
   */
  public static async fetchTransactions(): Promise<{
    data: TransactionWithRelations[];
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customer:customers (customer_id, name, phone_number, address),
          service:services (service_id, service_name, price_per_kg),
          user:users (user_id, name, role)
        `)
        .order('received_at', { ascending: false });

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const transactions = (data || []).map((row: any) => ({
        ...row,
        weight_kg: Number(row.weight_kg),
        price_per_kg: Number(row.price_per_kg),
        total_price: Number(row.total_price),
        amount_paid: Number(row.amount_paid),
        customer: row.customer || {
          customer_id: row.customer_id,
          name: 'Pelanggan',
          phone_number: '',
          address: null,
        },
        service: row.service || {
          service_id: row.service_id,
          service_name: 'Layanan',
          price_per_kg: Number(row.price_per_kg),
        },
        user: row.user || null,
      })) as TransactionWithRelations[];

      return { data: transactions, error: null };
    } catch (err: any) {
      return { data: [], error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Mengambil satu pesanan berdasarkan nomor nota (receipt_number) untuk pelacakan.
   */
  public static async fetchTransactionByReceipt(receiptNumber: string): Promise<{
    data: TransactionWithRelations | null;
    error: Error | null;
  }> {
    try {
      const cleanReceipt = receiptNumber.trim().toUpperCase();
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customer:customers (customer_id, name, phone_number, address),
          service:services (service_id, service_name, price_per_kg),
          user:users (user_id, name, role)
        `)
        .ilike('receipt_number', cleanReceipt)
        .maybeSingle();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (!data) {
        return { data: null, error: null };
      }

      const row = data as any;
      const formatted: TransactionWithRelations = {
        ...row,
        weight_kg: Number(row.weight_kg),
        price_per_kg: Number(row.price_per_kg),
        total_price: Number(row.total_price),
        amount_paid: Number(row.amount_paid),
        customer: row.customer || {
          customer_id: row.customer_id,
          name: 'Pelanggan',
          phone_number: '',
          address: null,
        },
        service: row.service || {
          service_id: row.service_id,
          service_name: 'Layanan',
          price_per_kg: Number(row.price_per_kg),
        },
        user: row.user || null,
      };

      return { data: formatted, error: null };
    } catch (err: any) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Mengambil daftar layanan aktif dari database.
   */
  public static async fetchServices(): Promise<{
    data: DbService[];
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('service_id');

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      return {
        data: (data || []).map((s) => ({
          ...s,
          price_per_kg: Number(s.price_per_kg),
        })),
        error: null,
      };
    } catch (err: any) {
      return { data: [], error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Menambahkan pesanan baru ke Supabase:
   * 1. Cari / buat customer baru
   * 2. Ambil snapshot harga layanan
   * 3. Insert ke tabel transactions
   * 4. Insert status awal ke status_history
   */
  public static async createTransaction(params: CreateTransactionParams): Promise<{
    data: TransactionWithRelations | null;
    error: Error | null;
  }> {
    try {
      // 1. Ambil session user saat ini jika ada (fallback ke ID Admin Sistem)
      const defaultAdminId = 'a0000000-0000-0000-0000-000000000001';
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id || params.userId || defaultAdminId;

      // 2. Ambil data layanan
      let service: DbService | null = null;
      if (params.serviceId) {
        const { data: svc } = await supabase
          .from('services')
          .select('*')
          .eq('service_id', params.serviceId)
          .maybeSingle();
        if (svc) service = { ...svc, price_per_kg: Number(svc.price_per_kg) };
      } else if (params.serviceName) {
        const { data: svc } = await supabase
          .from('services')
          .select('*')
          .ilike('service_name', params.serviceName.trim())
          .maybeSingle();
        if (svc) service = { ...svc, price_per_kg: Number(svc.price_per_kg) };
      }

      // Default jika layanan belum ada di Supabase
      const pricePerKg = service ? service.price_per_kg : 8000;
      const serviceId = service ? service.service_id : 1;
      const serviceName = service ? service.service_name : (params.serviceName || 'Cuci Setrika');

      // 3. Cari / Insert Customer
      let customerId: number = 1;
      const phone = (params.customerPhone || '').trim();
      if (phone) {
        const { data: existingCust } = await supabase
          .from('customers')
          .select('customer_id')
          .eq('phone_number', phone)
          .maybeSingle();

        if (existingCust) {
          customerId = existingCust.customer_id;
        } else {
          const { data: newCust, error: custErr } = await supabase
            .from('customers')
            .insert({
              name: params.customerName.trim(),
              phone_number: phone,
              address: params.customerAddress || null,
            })
            .select('customer_id')
            .maybeSingle();

          if (newCust) {
            customerId = newCust.customer_id;
          }
        }
      } else {
        const { data: newCust } = await supabase
          .from('customers')
          .insert({
            name: params.customerName.trim(),
            phone_number: '-',
            address: params.customerAddress || null,
          })
          .select('customer_id')
          .maybeSingle();

        if (newCust) {
          customerId = newCust.customer_id;
        }
      }

      // 4. Hitung harga dan nomor nota
      const totalPrice = params.weightKg * pricePerKg;
      const isPaid = !!params.isPaid;
      const paymentStatus: PaymentStatus = isPaid ? 'Paid' : 'Unpaid';
      const amountPaid = isPaid ? totalPrice : 0;
      const receiptNumber = `BLS-0${Math.floor(100 + Math.random() * 900)}`;

      // 5. Insert Transaksi
      const { data: insertedTx, error: txError } = await supabase
        .from('transactions')
        .insert({
          receipt_number: receiptNumber,
          customer_id: customerId,
          service_id: serviceId,
          user_id: currentUserId || defaultAdminId,
          weight_kg: params.weightKg,
          clothing_type: params.clothingType || 'Pakaian Umum',
          price_per_kg: pricePerKg,
          total_price: totalPrice,
          status: 'Received',
          payment_status: paymentStatus,
          payment_method: isPaid ? (params.paymentMethod ?? 'Cash') : null,
          amount_paid: amountPaid,
          paid_at: isPaid ? new Date().toISOString() : null,
        })
        .select(`
          *,
          customer:customers (customer_id, name, phone_number, address),
          service:services (service_id, service_name, price_per_kg),
          user:users (user_id, name, role)
        `)
        .single();

      if (txError) {
        return { data: null, error: new Error(txError.message) };
      }

      // 6. Catat riwayat status awal ke status_history jika user terautentikasi
      if (currentUserId && insertedTx?.transaction_id) {
        await supabase.from('status_history').insert({
          transaction_id: insertedTx.transaction_id,
          status: 'Received',
          user_id: currentUserId,
        });
      }

      const resRow = insertedTx as any;
      const fullRecord: TransactionWithRelations = {
        ...resRow,
        weight_kg: Number(resRow.weight_kg),
        price_per_kg: Number(resRow.price_per_kg),
        total_price: Number(resRow.total_price),
        amount_paid: Number(resRow.amount_paid),
        customer: resRow.customer || {
          customer_id: customerId,
          name: params.customerName,
          phone_number: params.customerPhone || '',
          address: null,
        },
        service: resRow.service || {
          service_id: serviceId,
          service_name: serviceName,
          price_per_kg: pricePerKg,
        },
        user: resRow.user || null,
      };

      return { data: fullRecord, error: null };
    } catch (err: any) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Mengubah status pesanan dan mencatat perubahan ke status_history.
   */
  public static async updateOrderStatus(
    receiptNumber: string,
    newStatus: LaundryStatus
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const defaultAdminId = 'a0000000-0000-0000-0000-000000000001';
      const currentUserId = sessionData?.session?.user?.id || defaultAdminId;

      const updatePayload: any = {
        status: newStatus,
      };

      if (newStatus === 'Completed') {
        updatePayload.completed_at = new Date().toISOString();
      } else if (newStatus === 'Picked Up') {
        updatePayload.picked_up_at = new Date().toISOString();
      }

      const { data: updatedTx, error } = await supabase
        .from('transactions')
        .update(updatePayload)
        .ilike('receipt_number', receiptNumber.trim())
        .select('transaction_id')
        .maybeSingle();

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      // Catat ke status_history
      if (updatedTx?.transaction_id) {
        await supabase.from('status_history').insert({
          transaction_id: updatedTx.transaction_id,
          status: newStatus,
          user_id: currentUserId,
        });
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Mengubah status pembayaran pesanan menjadi lunas di Supabase.
   */
  public static async updateOrderPayment(
    receiptNumber: string,
    paymentMethod: PaymentMethod,
    amountPaid?: number
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Ambil transaksi dulu untuk mengetahui total_price jika amountPaid tidak dispesifikasikan
      const { data: existing } = await supabase
        .from('transactions')
        .select('total_price')
        .ilike('receipt_number', receiptNumber.trim())
        .maybeSingle();

      const finalAmount = amountPaid ?? Number(existing?.total_price || 0);

      const { error } = await supabase
        .from('transactions')
        .update({
          payment_status: 'Paid',
          payment_method: paymentMethod,
          amount_paid: finalAmount,
          paid_at: new Date().toISOString(),
        })
        .ilike('receipt_number', receiptNumber.trim());

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Berlangganan perubahan data tabel transactions secara Realtime via Supabase WebSocket.
   */
  public static subscribeToTransactions(onChange: () => void): () => void {
    const channel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Memeriksa status koneksi ke Supabase dan ketersediaan session autentikasi.
   */
  public static async checkConnection(): Promise<{
    connected: boolean;
    authenticated: boolean;
    userEmail: string | null;
    role: string | null;
    error: string | null;
  }> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      let role: string | null = null;
      if (user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        role = userProfile?.role || null;
      }

      // Cek koneksi sederhana
      const { error: pingError } = await supabase
        .from('services')
        .select('service_id')
        .limit(1);

      return {
        connected: !pingError || pingError.code !== 'PGRST301',
        authenticated: !!user,
        userEmail: user?.email || null,
        role,
        error: pingError?.message || null,
      };
    } catch (err: any) {
      return {
        connected: false,
        authenticated: false,
        userEmail: null,
        role: null,
        error: err?.message || String(err),
      };
    }
  }
}
