'use client';

import React from 'react';
import { MaterialResultItem } from './types';

interface TabelRincianBahanProps {
  results: MaterialResultItem[];
  weightKg: number;
  totalCost: number;
}

export const TabelRincianBahan: React.FC<TabelRincianBahanProps> = ({
  results,
  weightKg,
  totalCost,
}) => {
  return (
    <div className="card table-rincian-card">
      <div className="card-top">
        <h3 className="section-title">Rincian Perhitungan & Estimasi Biaya Bahan</h3>
        <p className="section-subtitle">
          Formula estimasi kebutuhan bahan baku per kilogram cucian ({weightKg} kg)
        </p>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Bahan Baku</th>
              <th>Kategori</th>
              <th>Rasio Takaran</th>
              <th>Kebutuhan ({weightKg} kg)</th>
              <th>Stok Gudang</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Estimasi Biaya</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="mat-col">
                    <span className="mat-title">{row.name}</span>
                    <span className="mat-desc">{row.description}</span>
                  </div>
                </td>
                <td>{row.category}</td>
                <td>
                  {row.dosePerKg} {row.unit}/kg
                </td>
                <td className="bold-cell">
                  {row.formattedNeeded}
                </td>
                <td>{row.stockUnit}</td>
                <td>
                  <span
                    className={`badge ${
                      row.isSufficient ? 'badge-siap' : 'badge-keluar'
                    }`}
                  >
                    {row.isSufficient ? 'Cukup' : 'Kurang'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }} className="bold-cell">
                  Rp{row.estimatedCost.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Banner Footer */}
      <div className="table-footer-banner">
        <div className="footer-left">
          Total Estimasi Biaya Bahan Baku untuk {weightKg} kg:
        </div>
        <div className="footer-right">
          Rp{totalCost.toLocaleString('id-ID')}
        </div>
      </div>

      <style jsx>{`
        .table-rincian-card {
          padding: 24px;
          background: #ffffff;
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

        .mat-col {
          display: flex;
          flex-direction: column;
        }

        .mat-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .mat-desc {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 2px;
          max-width: 280px;
        }

        .bold-cell {
          font-weight: 700;
          color: #0f172a;
        }

        .table-footer-banner {
          margin-top: 18px;
          background-color: #e6f7f5;
          border-radius: var(--radius-md);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 700;
          color: #0f766e;
        }

        .footer-right {
          font-size: 16px;
          color: #0d9488;
        }
      `}</style>
    </div>
  );
};
