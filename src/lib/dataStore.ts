// Central Reactive Data Store for LaundryKu (MVVM Model Data Source)

export interface LaundryOrder {
  id: string; // e.g. BLS-0128
  customerName: string;
  customerPhone?: string;
  service: 'Cuci Setrika' | 'Cuci Kering' | 'Cuci Basah';
  weight: number; // in kg
  pricePerKg: number;
  totalPrice: number;
  paidAmount: number;
  isPaid: boolean;
  paymentMethod?: 'QRIS' | 'Tunai' | 'Transfer';
  status: 'Diterima' | 'Dicuci' | 'Disetrika' | 'Siap diambil' | 'Selesai';
  createdAt: string; // ISO or date string
  completedAt?: string;
  notes?: string;
}

export interface CashTransaction {
  id: string; // e.g. CF-0032
  description: string;
  category: 'Operasional' | 'Bahan baku' | 'Pembayaran QRIS' | 'Pembayaran Tunai';
  type: 'Kas masuk' | 'Kas keluar';
  amount: number;
  time: string; // e.g. 10.15
  date: string; // e.g. 8 Oktober 2026
  orderRef?: string;
}

export interface MaterialPrediction {
  materialName: string;
  currentStock: number;
  unit: string;
  predictedUsageToday: number;
  predictedUsage7Days: number;
  status: 'Aman' | 'Perlu Restok' | 'Kritis';
  recommendedRestock: number;
}

const INITIAL_ORDERS: LaundryOrder[] = [
  {
    id: 'BLS-0128',
    customerName: 'Aulia Putri',
    customerPhone: '081234567801',
    service: 'Cuci Setrika',
    weight: 6,
    pricePerKg: 8000,
    totalPrice: 48000,
    paidAmount: 48000,
    isPaid: true,
    paymentMethod: 'QRIS',
    status: 'Disetrika',
    createdAt: '2026-10-08T09:20:00Z',
  },
  {
    id: 'BLS-0127',
    customerName: 'Bima Pratama',
    customerPhone: '081234567802',
    service: 'Cuci Kering',
    weight: 4,
    pricePerKg: 6000,
    totalPrice: 24000,
    paidAmount: 0,
    isPaid: false,
    status: 'Dicuci',
    createdAt: '2026-10-08T09:10:00Z',
  },
  {
    id: 'BLS-0126',
    customerName: 'Citra Lestari',
    customerPhone: '081234567803',
    service: 'Cuci Basah',
    weight: 5,
    pricePerKg: 4000,
    totalPrice: 20000,
    paidAmount: 20000,
    isPaid: true,
    paymentMethod: 'QRIS',
    status: 'Siap diambil',
    createdAt: '2026-10-08T08:55:00Z',
  },
  {
    id: 'BLS-0125',
    customerName: 'Dimas Saputra',
    customerPhone: '081234567804',
    service: 'Cuci Setrika',
    weight: 8,
    pricePerKg: 8000,
    totalPrice: 64000,
    paidAmount: 64000,
    isPaid: true,
    paymentMethod: 'QRIS',
    status: 'Siap diambil',
    createdAt: '2026-10-08T08:45:00Z',
  },
  {
    id: 'BLS-0124',
    customerName: 'Eka Wulandari',
    customerPhone: '081234567805',
    service: 'Cuci Kering',
    weight: 3,
    pricePerKg: 6000,
    totalPrice: 18000,
    paidAmount: 0,
    isPaid: false,
    status: 'Diterima',
    createdAt: '2026-10-08T08:30:00Z',
  },
  {
    id: 'BLS-0123',
    customerName: 'Farah Nabila',
    customerPhone: '081234567806',
    service: 'Cuci Setrika',
    weight: 10,
    pricePerKg: 8000,
    totalPrice: 80000,
    paidAmount: 80000,
    isPaid: true,
    paymentMethod: 'QRIS',
    status: 'Selesai',
    createdAt: '2026-10-08T08:15:00Z',
  },
];

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

// In-memory + LocalStorage sync store for browser
class DataStore {
  private orders: LaundryOrder[] = [...INITIAL_ORDERS];
  private transactions: CashTransaction[] = [...INITIAL_TRANSACTIONS];
  private listeners: (() => void)[] = [];
  private initialCashBalance = 1250000;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedOrders = localStorage.getItem('laundryku_orders');
        const savedTx = localStorage.getItem('laundryku_transactions');
        if (savedOrders) this.orders = JSON.parse(savedOrders);
        if (savedTx) this.transactions = JSON.parse(savedTx);
      } catch (e) {
        console.error('Failed to load from localStorage', e);
      }
    }
  }

  private notify() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('laundryku_orders', JSON.stringify(this.orders));
        localStorage.setItem('laundryku_transactions', JSON.stringify(this.transactions));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getOrders(): LaundryOrder[] {
    return [...this.orders];
  }

  public getOrderById(id: string): LaundryOrder | undefined {
    return this.orders.find((o) => o.id.toLowerCase() === id.toLowerCase().trim());
  }

  public addOrder(orderData: Omit<LaundryOrder, 'id' | 'createdAt'>): LaundryOrder {
    const nextNumber = this.orders.length + 124;
    const newId = `BLS-0${nextNumber}`;
    const newOrder: LaundryOrder = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    this.orders = [newOrder, ...this.orders];

    if (newOrder.isPaid && newOrder.paidAmount > 0) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
      this.transactions = [
        ...this.transactions,
        {
          id: `CF-00${this.transactions.length + 33}`,
          description: newOrder.customerName,
          category: newOrder.paymentMethod === 'Tunai' ? 'Pembayaran Tunai' : 'Pembayaran QRIS',
          type: 'Kas masuk',
          amount: newOrder.paidAmount,
          time: timeStr,
          date: '8 Oktober 2026',
          orderRef: newOrder.id,
        },
      ];
    }

    this.notify();
    return newOrder;
  }

  public updateOrderStatus(id: string, newStatus: LaundryOrder['status']): boolean {
    const idx = this.orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      this.orders[idx] = {
        ...this.orders[idx],
        status: newStatus,
        completedAt: newStatus === 'Selesai' ? new Date().toISOString() : this.orders[idx].completedAt,
      };
      this.notify();
      return true;
    }
    return false;
  }

  public getTransactions(): CashTransaction[] {
    return [...this.transactions];
  }

  public addTransaction(txData: Omit<CashTransaction, 'id' | 'time' | 'date'>): CashTransaction {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    const newTx: CashTransaction = {
      ...txData,
      id: `CF-00${this.transactions.length + 33}`,
      time: timeStr,
      date: '8 Oktober 2026',
    };
    this.transactions = [newTx, ...this.transactions];
    this.notify();
    return newTx;
  }

  public getInitialCashBalance(): number {
    return this.initialCashBalance;
  }
}

export const dataStore = new DataStore();
