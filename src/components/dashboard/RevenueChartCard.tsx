'use client';

import React from 'react';
import { RevenueTrendItem } from './types';

interface RevenueChartCardProps {
  trendItems: RevenueTrendItem[];
  totalRevenue: number;
}

export const RevenueChartCard: React.FC<RevenueChartCardProps> = ({
  trendItems,
  totalRevenue,
}) => {
  const maxAmount = Math.max(...trendItems.map((item) => item.amountThousand), 250);

  return (
    <div className="card revenue-card">
      <div className="card-top-row">
        <div>
          <h3 className="section-title">Penerimaan pembayaran</h3>
          <p className="section-subtitle">
            Tren pemasukan selama tujuh hari terakhir
          </p>
        </div>
      </div>

      <div className="revenue-summary-row">
        <div className="revenue-stat">
          <div className="revenue-number">
            Rp{totalRevenue.toLocaleString('id-ID')}
          </div>
          <span className="period-badge">7 hari</span>
        </div>
        <div className="revenue-sublabel">Total 2–8 Oktober 2026</div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="chart-container">
        <div className="bars-track">
          {trendItems.map((item, index) => {
            const heightPercent = Math.round((item.amountThousand / maxAmount) * 100);

            return (
              <div key={index} className="bar-column">
                <span className="bar-tooltip-val">{item.amountThousand}</span>
                <div className="bar-slot">
                  <div
                    className={`bar-fill ${item.isToday ? 'active-today' : ''}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="bar-date-label">{item.dateLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-caption">
        Penerimaan pembayaran • dalam ribuan rupiah
      </div>

      <style jsx>{`
        .revenue-card {
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
        }

        .revenue-summary-row {
          margin-top: 18px;
          margin-bottom: 24px;
        }

        .revenue-stat {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .revenue-number {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.4px;
        }

        .period-badge {
          background-color: #e6f7f5;
          color: #0f766e;
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .revenue-sublabel {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        .chart-container {
          height: 160px;
          display: flex;
          align-items: flex-end;
          padding-top: 16px;
          margin-bottom: 12px;
        }

        .bars-track {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
        }

        .bar-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }

        .bar-tooltip-val {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .bar-slot {
          width: 100%;
          max-width: 50px;
          height: 110px;
          display: flex;
          align-items: flex-end;
        }

        .bar-fill {
          width: 100%;
          background: #b2dfdb; /* Soft teal for past days */
          border-radius: 4px;
          transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bar-fill:hover {
          filter: brightness(0.95);
        }

        .bar-fill.active-today {
          background: #0d9488; /* Darker primary teal for today */
        }

        .bar-date-label {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 8px;
        }

        .chart-caption {
          font-size: 11.5px;
          color: #94a3b8;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
};
