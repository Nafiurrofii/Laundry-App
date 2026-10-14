'use client';

import React from 'react';
import { FinancialRecap } from './types';

interface FinancialSummaryCardProps {
  recap: FinancialRecap;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ recap }) => {
  return (
    <div className="card recap-card">
      <h3 className="section-title">Ringkasan keuangan</h3>

      <div className="recap-list">
        <div className="recap-row">
          <span className="recap-label">Penerimaan pembayaran</span>
          <span className="recap-value">
            Rp{recap.revenuePayment.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="recap-row">
          <span className="recap-label">Pengeluaran</span>
          <span className="recap-value">
            Rp{recap.expenses.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="recap-row highlight-net">
          <span className="recap-label">Arus kas bersih</span>
          <span className="recap-value text-teal">
            +Rp{recap.netCashFlow.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="recap-row">
          <span className="recap-label">Tagihan belum lunas</span>
          <span className="recap-value text-muted">
            Rp{recap.unpaidInvoices.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <style jsx>{`
        .recap-card {
          padding: 24px;
          background: #ffffff;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .recap-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .recap-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
        }

        .recap-label {
          color: #64748b;
        }

        .recap-value {
          font-weight: 700;
          color: #0f172a;
        }

        .text-teal {
          color: #0d9488;
        }

        .text-muted {
          color: #475569;
        }
      `}</style>
    </div>
  );
};
