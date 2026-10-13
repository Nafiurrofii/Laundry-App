import { dataStore, LaundryOrder } from '@/lib/dataStore';

export class LandingMutations {
  public static searchTracking(orderId: string): LaundryOrder | null {
    return dataStore.getOrderById(orderId) || null;
  }
}
