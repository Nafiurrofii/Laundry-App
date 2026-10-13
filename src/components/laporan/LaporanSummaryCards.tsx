'use client';

import React from 'react';
import { FileText, Receipt, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { LaporanSummary } from './types';

interface LaporanSummaryCardsProps {
  summary: LaporanSummary;
}

export const LaporanSummaryCards: React.FC<LaporanSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="laporan-cards-grid">
      {/* Total pesanan */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Total pesanan</span>
          <FileText size={17} className="icon-teal" />
        </div>
        <div className="card-value">{summary.totalOrders}</div>
        <div className="card-desc">{summary.totalWeight} kg pakaian</div>
      </div>

      {/* Nilai pesanan */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Nilai pesanan</span>
          <Receipt size={17} className="icon-teal" />
        </div>
        <div className="card-value">
          Rp{summary.totalOrderValue.toLocaleString('id-ID')}
        </div>
        <div className="card-desc">Lunas + belum lunas</div>
      </div>

      {/* Kas masuk */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Kas masuk</span>
          <ArrowDownLeft size={17} className="icon-teal" />
        </div>
        <div className="card-value">
          Rp{summary.incomingCash.toLocaleString('id-ID')}
        </div>
        <div className="card-desc">{summary.paidOrdersCount} pembayaran QRIS</div>
      </div>

      {/* Kas keluar */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title">Kas keluar</span>
          <ArrowUpRight size={17} className="icon-teal" />
        </div>
        <div className="card-value">
          Rp{summary.outgoingCash.toLocaleString('id-ID')}
        </div>
        <div className="card-desc">Bahan & operasional</div>
      </div>

      <style jsx>{`
        .laporan-cards-grid {
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

        .card-desc {
          margin-top: 10px;
          font-size: 12.5px;
          color: #64748b;
        }

        @media (max-width: 1024px) {
          .laporan-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
