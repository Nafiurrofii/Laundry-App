'use client';

import React from 'react';
import { ServiceDetailRow } from './types';

interface ServiceBreakdownTableProps {
  details: ServiceDetailRow[];
  totalDetail: {
    orderCount: number;
    weight: number;
    orderValue: number;
    paidAmount: number;
  };
}

export const ServiceBreakdownTable: React.FC<ServiceBreakdownTableProps> = ({
  details,
  totalDetail,
}) => {
  return (
    <div className="card table-card">
      <div className="card-top">
        <h3 className="section-title">Rincian per layanan</h3>
        <p className="section-subtitle">Periode 8 Oktober 2026</p>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Layanan</th>
              <th>Pesanan</th>
              <th>Berat</th>
              <th>Nilai pesanan</th>
              <th style={{ textAlign: 'right' }}>Sudah dibayar</th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, idx) => (
              <tr key={idx}>
                <td className="svc-title-cell">{row.serviceName}</td>
                <td>{row.orderCount}</td>
                <td>{row.weight} kg</td>
                <td className="bold-cell">
                  Rp{row.orderValue.toLocaleString('id-ID')}
                </td>
                <td style={{ textAlign: 'right' }} className="bold-cell">
                  Rp{row.paidAmount.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary highlight banner footer */}
      <div className="table-total-banner">
        <div className="total-left">
          Total • {totalDetail.orderCount} pesanan • {totalDetail.weight} kg
        </div>
        <div className="total-right">
          Nilai Rp{totalDetail.orderValue.toLocaleString('id-ID')} • Dibayar Rp
          {totalDetail.paidAmount.toLocaleString('id-ID')}
        </div>
      </div>

      <style jsx>{`
        .table-card {
          padding: 24px;
          background: #ffffff;
          margin-top: 24px;
          margin-bottom: 24px;
        }

        .card-top {
          margin-bottom: 20px;
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

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .svc-title-cell {
          font-weight: 700;
          color: #0f172a;
        }

        .bold-cell {
          font-weight: 600;
          color: #0f172a;
        }

        .table-total-banner {
          margin-top: 16px;
          background-color: #e6f7f5;
          border-radius: var(--radius-md);
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
          color: #0f766e;
        }
      `}</style>
    </div>
  );
};
