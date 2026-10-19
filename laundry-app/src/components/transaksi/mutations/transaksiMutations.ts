import { dataStore } from '@/lib/dataStore';
import { cashFlowStore } from '@/lib/cashFlowStore';
import type { PaymentMethod } from '@/lib/database.types';

export class TransaksiMutations {
  /**
   * Tandai order sebagai lunas.
   * @param receiptNumber - nomor nota (receipt_number)
   * @param method - metode pembayaran sesuai enum DB ('Cash' | 'QRIS' | 'Bank Transfer')
   */
  public static markAsPaid(receiptNumber: string, method: PaymentMethod): boolean {
    const order = dataStore.getOrderByReceiptNumber(receiptNumber);
    if (!order) return false;

    // Update payment status di dataStore
    dataStore.updateOrderPayment(receiptNumber, method, order.total_price);

    // Catat arus kas masuk
    cashFlowStore.addTransaction({
      description: order.customer.name,
      category: method === 'Cash' ? 'Pembayaran Tunai' : method === 'QRIS' ? 'Pembayaran QRIS' : 'Pembayaran Transfer',
      type: 'Kas masuk',
      amount: order.total_price,
      orderRef: order.receipt_number,
    });

    return true;
  }
}
