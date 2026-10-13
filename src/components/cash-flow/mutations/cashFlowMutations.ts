import { dataStore, CashTransaction } from '@/lib/dataStore';
import { CreateExpenseInput } from '../types';

export class CashFlowMutations {
  public static addExpense(input: CreateExpenseInput): CashTransaction {
    return dataStore.addTransaction({
      description: input.description,
      category: input.category,
      type: 'Kas keluar',
      amount: input.amount,
    });
  }

  public static exportToCSV(transactions: CashTransaction[]): void {
    const headers = ['ID', 'Keterangan', 'Kategori', 'Jenis', 'Nominal', 'Waktu', 'Tanggal'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.description}"`,
      t.category,
      t.type,
      t.amount,
      t.time,
      `"${t.date}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riwayat_kas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
