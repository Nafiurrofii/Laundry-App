'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { CashTransaction } from '@/lib/dataStore';
import { CashFlowTab } from './types';

interface CashHistoryTableProps {
  transactions: CashTransaction[];
  activeTab: CashFlowTab;
  onTabChange: (tab: CashFlowTab) => void;
  tabCounts: {
    semua: number;
    masuk: number;
    keluar: number;
  };
  onExportCSV: () => void;
}

export const CashHistoryTable: React.FC<CashHistoryTableProps> = ({
  transactions,
  activeTab,
  onTabChange,
  tabCounts,
  onExportCSV,
}) => {
  return (
    <div className="card history-card">
      <div className="history-header">
        <div>
          <h3 className="section-title">Riwayat kas</h3>
          <p className="section-subtitle">
            8 Oktober 2026 • {tabCounts.semua} catatan
          </p>
        </div>
      </div>

      {/* Tabs & Export CSV row */}
      <div className="history-actions-row">
        <div className="tabs-bar">
          <button
            className={`filter-pill ${activeTab === 'semua' ? 'active' : ''}`}
            onClick={() => onTabChange('semua')}
          >
            Semua ({tabCounts.semua})
          </button>
          <button
            className={`filter-pill ${activeTab === 'masuk' ? 'active' : ''}`}
            onClick={() => onTabChange('masuk')}
          >
            Kas masuk ({tabCounts.masuk})
          </button>
          <button
            className={`filter-pill ${activeTab === 'keluar' ? 'active' : ''}`}
            onClick={() => onTabChange('keluar')}
          >
            Kas keluar ({tabCounts.keluar})
          </button>
        </div>

        <button className="btn-outline export-btn" onClick={onExportCSV}>
          <Download size={15} />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Table Data */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Keterangan</th>
              <th>Kategori</th>
              <th>Jenis</th>
              <th style={{ textAlign: 'right' }}>Nominal</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-cell">
                  Tidak ada catatan kas pada kategori ini.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isIncome = tx.type === 'Kas masuk';
                return (
                  <tr key={tx.id}>
                    <td>
                      <div className="tx-desc-cell">
                        <span className="tx-title">{tx.description}</span>
                        <span className="tx-meta">
                          {tx.id} • {tx.time}
                        </span>
                      </div>
                    </td>
                    <td>{tx.category}</td>
                    <td>
                      <span
                        className={`badge ${
                          isIncome ? 'badge-masuk' : 'badge-keluar'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      style={{ textAlign: 'right' }}
                      className={`nominal-cell ${
                        isIncome ? 'nominal-income' : 'nominal-expense'
                      }`}
                    >
                      {isIncome ? '+' : '-'}Rp{tx.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="history-footer">
        <span className="footer-count">
          Menampilkan {transactions.length} dari {tabCounts.semua} catatan
        </span>
      </div>

      <style jsx>{`
        .history-card {
          padding: 24px;
          background: #ffffff;
          margin-bottom: 24px;
        }

        .history-header {
          margin-bottom: 18px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .section-subtitle {
          font-size: 12.5px;
          color: #64748b;
          margin-top: 2px;
        }

        .history-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .tabs-bar {
          display: flex;
          gap: 8px;
        }

        .filter-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background-color: transparent;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .filter-pill:hover {
          background-color: #f1f5f9;
        }

        .filter-pill.active {
          background-color: #0f766e;
          color: #ffffff;
        }

        .export-btn {
          padding: 6px 14px;
          font-size: 13px;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .tx-desc-cell {
          display: flex;
          flex-direction: column;
        }

        .tx-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
        }

        .tx-meta {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 2px;
        }

        .nominal-cell {
          font-size: 13.5px;
          font-weight: 700;
        }

        .nominal-income {
          color: #0d9488;
        }

        .nominal-expense {
          color: #0f172a;
        }

        .empty-cell {
          text-align: center;
          padding: 32px !important;
          color: #94a3b8;
        }

        .history-footer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .footer-count {
          font-size: 12.5px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};
