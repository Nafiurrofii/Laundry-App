import { dataStore, cashFlowStore } from '@/lib/dataStore';
import {
  LaporanSummary,
  ServiceCompositionItem,
  ServiceDetailRow,
  FinancialRecap,
} from '../types';

export class LaporanService {
  public static getReportData() {
    const orders = dataStore.getOrders();
    const transactions = cashFlowStore.getTransactions();

    const totalWeight = orders.reduce((sum, o) => sum + (o.weight_kg || 0), 0);
    const totalOrderValue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);

    const paidOrders = orders.filter((o) => o.payment_status === 'Paid');
    const incomingCash = orders.reduce((sum, o) => sum + (o.amount_paid || 0), 0);

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
      const matching = orders.filter((o) => o.service?.service_name === svc);
      const weight = matching.reduce((sum, o) => sum + (o.weight_kg || 0), 0);
      const orderValue = matching.reduce((sum, o) => sum + (o.total_price || 0), 0);
      const paid = matching.reduce((sum, o) => sum + (o.amount_paid || 0), 0);

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
