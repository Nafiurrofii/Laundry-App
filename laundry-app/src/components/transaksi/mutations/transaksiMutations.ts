import { dataStore } from '@/lib/dataStore';

export class TransaksiMutations {
  public static markAsPaid(id: string, method: 'QRIS' | 'Tunai'): boolean {
    const order = dataStore.getOrderById(id);
    if (!order) return false;

    // Tambah transaksi kas masuk
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;

    dataStore.addTransaction({
      description: order.customerName,
      category: method === 'Tunai' ? 'Pembayaran Tunai' : 'Pembayaran QRIS',
      type: 'Kas masuk',
      amount: order.totalPrice,
      orderRef: order.id,
    });

    return true;
  }
}
