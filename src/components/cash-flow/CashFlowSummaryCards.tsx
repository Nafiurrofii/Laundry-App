'use client';

import React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Landmark } from 'lucide-react';
import { CashFlowSummary } from './types';

interface CashFlowSummaryCardsProps {
  summary: CashFlowSummary;
}

export const CashFlowSummaryCards: React.FC<CashFlowSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="summary-cards-grid">
      {/* Saldo awal */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Saldo awal</span>
          <Wallet size={17} className="icon-teal" />
        </div>
        <div className="card-value">
          Rp{summary.startingBalance.toLocaleString('id-ID')}
        </div>
        <div className="card-footer">Awal 8 Oktober 2026</div>
      </div>

      {/* Kas masuk */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Kas masuk</span>
          <ArrowDownLeft size={17} className="icon-teal" />
        </div>
        <div className="card-value">
          Rp{summary.totalIncome.toLocaleString('id-ID')}
        </div>
        <div className="card-footer">{summary.incomeCount} pembayaran pesanan</div>
      </div>

      {/* Kas keluar */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Kas keluar</span>
          <ArrowUpRight size={17} className="icon-teal" />
        </div>
        <div className="card-value">
          Rp{summary.totalExpense.toLocaleString('id-ID')}
        </div>
        <div className="card-footer">{summary.expenseCount} pengeluaran</div>
      </div>

      {/* Saldo akhir */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Saldo akhir</span>
          <Landmark size={17} className="icon-teal" />
        </div>
        <div className="card-value">
          Rp{summary.endingBalance.toLocaleString('id-ID')}
        </div>
        <div className="card-footer">Saldo awal + arus bersih</div>
      </div>

      <style jsx>{`
        .summary-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .summary-card {
          padding: 20px 22px;
          background: #ffffff;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .card-title {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
        }

        .icon-teal {
          color: #0d9488;
        }

        .card-value {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.4px;
        }

        .card-footer {
          margin-top: 10px;
          font-size: 12.5px;
          color: #64748b;
        }

        @media (max-width: 1024px) {
          .summary-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
