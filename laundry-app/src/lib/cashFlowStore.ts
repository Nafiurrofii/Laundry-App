// ============================================================
// Cash Flow Store – local in-memory store (not in Supabase DB)
// Handles operational cash in/out entries
// ============================================================

export interface CashTransaction {
    id: string; // e.g. CF-0032
    description: string;
    category: 'Operasional' | 'Bahan baku' | 'Pembayaran QRIS' | 'Pembayaran Tunai' | 'Pembayaran Transfer';
    type: 'Kas masuk' | 'Kas keluar';
    amount: number;
    time: string; // e.g. "10.15"
    date: string; // e.g. "8 Oktober 2026"
    orderRef?: string; // receipt_number of the linked transaction
}

const INITIAL_TRANSACTIONS: CashTransaction[] = [
    {
        id: 'CF-0032',
        description: 'Listrik & air',
        category: 'Operasional',
        type: 'Kas keluar',
        amount: 25000,
        time: '10.15',
        date: '8 Oktober 2026',
    },
    {
        id: 'CF-0031',
        description: 'Pembelian parfum',
        category: 'Bahan baku',
        type: 'Kas keluar',
        amount: 15000,
        time: '10.00',
        date: '8 Oktober 2026',
    },
    {
        id: 'CF-0030',
        description: 'Pembelian sabun',
        category: 'Bahan baku',
        type: 'Kas keluar',
        amount: 25000,
        time: '09.45',
        date: '8 Oktober 2026',
    },
    {
        id: 'CF-0029',
        description: 'Aulia Putri',
        category: 'Pembayaran QRIS',
        type: 'Kas masuk',
        amount: 48000,
        time: '09.20',
        date: '8 Oktober 2026',
        orderRef: 'BLS-0128',
    },
    {
        id: 'CF-0028',
        description: 'Citra Lestari',
        category: 'Pembayaran QRIS',
        type: 'Kas masuk',
        amount: 20000,
        time: '08.55',
        date: '8 Oktober 2026',
        orderRef: 'BLS-0126',
    },
    {
        id: 'CF-0027',
        description: 'Dimas Saputra',
        category: 'Pembayaran QRIS',
        type: 'Kas masuk',
        amount: 64000,
        time: '08.45',
        date: '8 Oktober 2026',
        orderRef: 'BLS-0125',
    },
    {
        id: 'CF-0026',
        description: 'Farah Nabila',
        category: 'Pembayaran QRIS',
        type: 'Kas masuk',
        amount: 80000,
        time: '08.15',
        date: '8 Oktober 2026',
        orderRef: 'BLS-0123',
    },
];

class CashFlowStore {
    private transactions: CashTransaction[] = [...INITIAL_TRANSACTIONS];
    private listeners: (() => void)[] = [];
    private initialCashBalance = 1250000;

    constructor() {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('laundryku_cash_transactions');
                if (saved) this.transactions = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load cash transactions from localStorage', e);
            }
        }
    }

    private notify() {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('laundryku_cash_transactions', JSON.stringify(this.transactions));
            } catch (e) {
                console.error('Failed to save cash transactions to localStorage', e);
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

    public getTransactions(): CashTransaction[] {
        return [...this.transactions];
    }

    public addTransaction(
        txData: Omit<CashTransaction, 'id' | 'time' | 'date'>
    ): CashTransaction {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
        const newTx: CashTransaction = {
            ...txData,
            id: `CF-00${this.transactions.length + 33}`,
            time: timeStr,
            date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        };
        this.transactions = [newTx, ...this.transactions];
        this.notify();
        return newTx;
    }

    public getInitialCashBalance(): number {
        return this.initialCashBalance;
    }
}

export const cashFlowStore = new CashFlowStore();
