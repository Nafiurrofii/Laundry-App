export interface LaporanSummary {
  totalOrders: number;
  totalWeight: number;
  totalOrderValue: number;
  incomingCash: number;
  paidOrdersCount: number;
  outgoingCash: number;
}

export interface ServiceCompositionItem {
  serviceName: string;
  weight: number;
  percentage: number;
}

export interface ServiceDetailRow {
  serviceName: string;
  orderCount: number;
  weight: number;
  orderValue: number;
  paidAmount: number;
}

export interface FinancialRecap {
  revenuePayment: number;
  expenses: number;
  netCashFlow: number;
  unpaidInvoices: number;
}

export interface LaporanViewModelState {
  summary: LaporanSummary;
  serviceComposition: ServiceCompositionItem[];
  serviceDetails: ServiceDetailRow[];
  totalDetail: {
    orderCount: number;
    weight: number;
    orderValue: number;
    paidAmount: number;
  };
  financialRecap: FinancialRecap;
  total7DaysRevenue: number;
}
