'use client';

import React from 'react';
import { OperationalStatusCounts } from './types';

interface OperationalStatusCardProps {
  statusCounts: OperationalStatusCounts;
}

export const OperationalStatusCard: React.FC<OperationalStatusCardProps> = ({
  statusCounts,
}) => {
  const total = statusCounts.total || 1;

  // Segment proportions
  const diterimaPct = (statusCounts.diterima / total) * 100;
  const dicuciPct = (statusCounts.dicuci / total) * 100;
  const disetrikaPct = (statusCounts.disetrika / total) * 100;
  const siapPct = (statusCounts.siapDiambil / total) * 100;
  const selesaiPct = (statusCounts.selesai / total) * 100;

  return (
    <div className="card operational-card">
      <div className="card-top">
        <h3 className="section-title">Status operasional</h3>
        <p className="section-subtitle">
          {statusCounts.total} pesanan diterima hari ini
        </p>
      </div>

      {/* Multi-segmented visual bar */}
      <div className="segmented-bar-track">
        {statusCounts.diterima > 0 && (
          <div
            className="segment seg-diterima"
            style={{ width: `${diterimaPct}%` }}
            title={`Diterima: ${statusCounts.diterima}`}
          />
        )}
        {statusCounts.dicuci > 0 && (
          <div
            className="segment seg-dicuci"
            style={{ width: `${dicuciPct}%` }}
            title={`Dicuci: ${statusCounts.dicuci}`}
          />
        )}
        {statusCounts.disetrika > 0 && (
          <div
            className="segment seg-disetrika"
            style={{ width: `${disetrikaPct}%` }}
            title={`Disetrika: ${statusCounts.disetrika}`}
          />
        )}
        {statusCounts.siapDiambil > 0 && (
          <div
            className="segment seg-siap"
            style={{ width: `${siapPct}%` }}
            title={`Siap diambil: ${statusCounts.siapDiambil}`}
          />
        )}
        {statusCounts.selesai > 0 && (
          <div
            className="segment seg-selesai"
            style={{ width: `${selesaiPct}%` }}
            title={`Selesai: ${statusCounts.selesai}`}
          />
        )}
      </div>

      {/* Breakdown rows */}
      <div className="status-rows-list">
        <div className="status-row">
          <span className="row-label">Diterima</span>
          <span className="row-value">{statusCounts.diterima} pesanan</span>
        </div>

        <div className="status-row">
          <span className="row-label">Dicuci</span>
          <span className="row-value">{statusCounts.dicuci} pesanan</span>
        </div>

        <div className="status-row">
          <span className="row-label">Disetrika</span>
          <span className="row-value">{statusCounts.disetrika} pesanan</span>
        </div>

        <div className="status-row">
          <span className="row-label">Siap diambil</span>
          <span className="row-value font-bold">{statusCounts.siapDiambil} pesanan</span>
        </div>

        <div className="status-row">
          <span className="row-label">Selesai / diambil</span>
          <span className="row-value">{statusCounts.selesai} pesanan</span>
        </div>
      </div>

      <style jsx>{`
        .operational-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
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
          margin-bottom: 20px;
        }

        .segmented-bar-track {
          display: flex;
          height: 10px;
          gap: 6px;
          margin-bottom: 24px;
        }

        .segment {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .seg-diterima {
          background-color: #94a3b8;
        }

        .seg-dicuci {
          background-color: #818cf8;
        }

        .seg-disetrika {
          background-color: #0d9488;
        }

        .seg-siap {
          background-color: #6ee7b7;
        }

        .seg-selesai {
          background-color: #1e293b;
        }

        .status-rows-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
        }

        .row-label {
          color: #475569;
        }

        .row-value {
          font-weight: 600;
          color: #0f172a;
        }

        .row-value.font-bold {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
