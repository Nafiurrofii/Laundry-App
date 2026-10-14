'use client';

import React from 'react';
import { Calendar, ChevronDown, Plus } from 'lucide-react';
import { useCashFlowViewModel } from './hooks/useCashFlowViewModel';
import { CashFlowSummaryCards } from './CashFlowSummaryCards';
import { NetCashBanner } from './NetCashBanner';
import { CashHistoryTable } from './CashHistoryTable';
import { ExpenseCompositionCard } from './ExpenseCompositionCard';
import { AddExpenseModal } from './AddExpenseModal';

export const CashFlowView: React.FC = () => {
  const {
    filteredTransactions,
    summary,
    expenseComposition,
    activeTab,
    setActiveTab,
    tabCounts,
    isAddExpenseModalOpen,
    openAddExpenseModal,
    closeAddExpenseModal,
    handleAddExpense,
    handleExportCSV,
  } = useCashFlowViewModel();

  return (
    <div className="cash-flow-view">
      {/* Header */}
      <div className="cash-flow-header">
        <div className="header-top-row">
          <div>
            <h1 className="page-title">Cash flow</h1>
            <p className="page-subtitle">
              Catat pergerakan kas dan jaga keuangan tetap terpantau.
            </p>
          </div>

          <button className="btn-primary" onClick={openAddExpenseModal}>
            <Plus size={18} />
            <span>Catat pengeluaran</span>
          </button>
        </div>

        <div className="header-meta-row">
          <button className="date-picker-btn">
            <Calendar size={16} className="calendar-icon" />
            <span>8 Oktober 2026</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>

          <span className="today-badge">Hari ini</span>
          <span className="last-updated">Terakhir diperbarui 10.30 WIB</span>
        </div>
      </div>

      {/* 4 Cards Ringkasan Saldo */}
      <CashFlowSummaryCards summary={summary} />

      {/* Dark Banner Arus Kas Bersih */}
      <NetCashBanner summary={summary} />

      {/* Tabel Riwayat Kas */}
      <CashHistoryTable
        transactions={filteredTransactions}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={tabCounts}
        onExportCSV={handleExportCSV}
      />

      {/* Komposisi Pengeluaran */}
      <ExpenseCompositionCard
        composition={expenseComposition}
        totalExpense={summary.totalExpense}
      />

      {/* Footer Info */}
      <div className="page-footer-note">
        Risky Laundry • Data contoh, 8 Oktober 2026
      </div>

      {/* Modal Tambah Pengeluaran */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={closeAddExpenseModal}
        onSubmit={handleAddExpense}
      />

      <style jsx>{`
        .cash-flow-view {
          display: flex;
          flex-direction: column;
        }

        .cash-flow-header {
          margin-bottom: 24px;
        }

        .header-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .header-meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
        }

        .date-picker-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .calendar-icon {
          color: #0d9488;
        }

        .chevron-icon {
          color: #94a3b8;
        }

        .today-badge {
          background-color: #e6f7f5;
          color: #0f766e;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .last-updated {
          font-size: 12.5px;
          color: #64748b;
        }

        .page-footer-note {
          margin-top: 32px;
          font-size: 12px;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};
