import { dataStore, LaundryOrder } from '@/lib/dataStore';
import { SupabaseService } from '@/lib/supabaseService';
import { ServicePricePlan } from '../types';

export class LandingService {
  public static getServicePlans(): ServicePricePlan[] {
    return [
      {
        id: 'svc-1',
        name: 'Cuci Kering',
        pricePerKg: 6000,
        description: 'Dicuci bersih dan dikeringkan. Praktis untuk pakaian sehari-hari.',
        features: ['Cuci + pengeringan', 'Dilipat rapi, tanpa setrika'],
        duration: 'Estimasi selesai 2 hari',
        iconType: 'kering',
      },
      {
        id: 'svc-2',
        name: 'Cuci Setrika',
        pricePerKg: 8000,
        description: 'Pakaian bersih, wangi, dan licin. Siap dipakai tanpa repot.',
        features: ['Cuci + kering + setrika', 'Dilipat dan dikemas rapi'],
        duration: 'Estimasi selesai 2–3 hari',
        iconType: 'setrika',
      },
      {
        id: 'svc-3',
        name: 'Cuci Basah',
        pricePerKg: 4000,
        description: 'Dicuci dan dibilas bersih. Pengeringan dilakukan sendiri di rumah.',
        features: ['Cuci + bilas + peras', 'Tanpa pengeringan & setrika'],
        duration: 'Estimasi selesai 1 hari',
        iconType: 'basah',
      },
    ];
  }

  public static async trackOrder(orderId: string): Promise<LaundryOrder | null> {
    try {
      const { data } = await SupabaseService.fetchTransactionByReceipt(orderId);
      if (data) return data;
    } catch (e) {
      console.warn('Error fetching tracking from Supabase:', e);
    }
    return dataStore.getOrderById(orderId) || null;
  }
}

