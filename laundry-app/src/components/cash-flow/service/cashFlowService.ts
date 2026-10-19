import { cashFlowStore, CashTransaction } from '@/lib/cashFlowStore';
import { CashFlowSummary, ExpenseCompositionItem, CashFlowTab } from '../types';

export class CashFlowService {
  public static getAllTransactions(): CashTransaction[] {
    return cashFlowStore.getTransactions();
  }

  public static getSummary(transactions: CashTransaction[]): CashFlowSummary {
    const startingBalance = cashFlowStore.getInitialCashBalance();

    const incomeList = transactions.filter((t) => t.type === 'Kas masuk');
    const expenseList = transactions.filter((t) => t.type === 'Kas keluar');

    const totalIncome = incomeList.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseList.reduce((sum, t) => sum + t.amount, 0);
    const netCash = totalIncome - totalExpense;
    const endingBalance = startingBalance + netCash;

    return {
      startingBalance,
      totalIncome,
      incomeCount: incomeList.length,
      totalExpense,
      expenseCount: expenseList.length,
      endingBalance,
      netCash,
    };
  }

  public static getExpenseComposition(
    transactions: CashTransaction[]
  ): ExpenseCompositionItem[] {
    const expenses = transactions.filter((t) => t.type === 'Kas keluar');

    const rawMaterials = expenses
      .filter((t) => t.category === 'Bahan baku')
      .reduce((sum, t) => sum + t.amount, 0);

    const operational = expenses
      .filter((t) => t.category === 'Operasional')
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      {
        label: 'Bahan baku',
        sublabel: 'sabun & parfum',
        amount: rawMaterials || 40000,
      },
      {
        label: 'Operasional',
        sublabel: 'listrik & air',
        amount: operational || 25000,
      },
    ];
  }

  public static filterTransactions(
    transactions: CashTransaction[],
    tab: CashFlowTab
  ): CashTransaction[] {
    if (tab === 'masuk') {
      return transactions.filter((t) => t.type === 'Kas masuk');
    }
    if (tab === 'keluar') {
      return transactions.filter((t) => t.type === 'Kas keluar');
    }
    return transactions;
  }
}

