import { CashTransaction } from '@/lib/dataStore';

export type CashFlowTab = 'semua' | 'masuk' | 'keluar';

export interface CashFlowSummary {
  startingBalance: number;
  totalIncome: number;
  incomeCount: number;
  totalExpense: number;
  expenseCount: number;
  endingBalance: number;
  netCash: number;
}

export interface ExpenseCompositionItem {
  label: string;
  sublabel: string;
  amount: number;
}

export interface CreateExpenseInput {
  description: string;
  category: 'Operasional' | 'Bahan baku';
  amount: number;
}

export interface CashFlowViewModelState {
  transactions: CashTransaction[];
  filteredTransactions: CashTransaction[];
  summary: CashFlowSummary;
  expenseComposition: ExpenseCompositionItem[];
  activeTab: CashFlowTab;
  tabCounts: {
    semua: number;
    masuk: number;
    keluar: number;
  };
  isAddExpenseModalOpen: boolean;
}
