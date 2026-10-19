import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { SupabaseService } from '@/lib/supabaseService';

export class LandingMutations {
  public static async searchTracking(orderId: string): Promise<LaundryOrder | null> {
    try {
      const { data, error } = await SupabaseService.fetchTransactionByReceipt(orderId);
      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase tracking query error, using local fallback:', e);
    }
    return dataStore.getOrderById(orderId) || null;
  }
}

