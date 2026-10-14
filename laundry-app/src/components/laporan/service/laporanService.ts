import { dataStore, LaundryOrder, CashTransaction } from '@/lib/dataStore';
import {
  LaporanSummary,
  ServiceCompositionItem,
  ServiceDetailRow,
  FinancialRecap,
} from '../types';

export class LaporanService {
  public static getReportData() {
    const orders = dataStore.getOrders();
    const transactions = dataStore.getTransactions();

    const totalWeight = orders.reduce((sum, o) => sum + o.weight, 0);
    const totalOrderValue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    const paidOrders = orders.filter((o) => o.isPaid);
    const incomingCash = paidOrders.reduce((sum, o) => sum + o.paidAmount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'Kas keluar')
      .reduce((sum, t) => sum + t.amount, 0);

    const unpaidInvoices = totalOrderValue - incomingCash;

    // Summary
    const summary: LaporanSummary = {
      totalOrders: orders.length,
      totalWeight,
      totalOrderValue,
      incomingCash,
      paidOrdersCount: paidOrders.length,
      outgoingCash: expenses,
    };

    // Services
    const serviceNames = ['Cuci Setrika', 'Cuci Kering', 'Cuci Basah'];
    const serviceDetails: ServiceDetailRow[] = serviceNames.map((svc) => {
      const matching = orders.filter((o) => o.service === svc);
      const weight = matching.reduce((sum, o) => sum + o.weight, 0);
      const orderValue = matching.reduce((sum, o) => sum + o.totalPrice, 0);
      const paid = matching.reduce((sum, o) => sum + (o.isPaid ? o.paidAmount : 0), 0);

      return {
        serviceName: svc,
        orderCount: matching.length,
        weight,
        orderValue,
        paidAmount: paid,
      };
    });

    const totalDetail = {
      orderCount: orders.length,
      weight: totalWeight,
      orderValue: totalOrderValue,
      paidAmount: incomingCash,
    };

    // Service Composition
    const serviceComposition: ServiceCompositionItem[] = serviceDetails.map((d) => ({
      serviceName: d.serviceName,
      weight: d.weight,
      percentage: totalWeight > 0 ? Math.round((d.weight / totalWeight) * 1000) / 10 : 0,
    }));

    // Financial Recap
    const financialRecap: FinancialRecap = {
      revenuePayment: incomingCash,
      expenses,
      netCashFlow: incomingCash - expenses,
      unpaidInvoices: unpaidInvoices > 0 ? unpaidInvoices : 0,
    };

    return {
      summary,
      serviceComposition,
      serviceDetails,
      totalDetail,
      financialRecap,
      total7DaysRevenue: 1480000,
    };
  }
}
