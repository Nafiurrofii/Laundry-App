'use client';

import React from 'react';
import { FileText, ShoppingBag, Wallet, Package } from 'lucide-react';
import { DashboardMetrics } from './types';

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const readyNames =
    metrics.readyPickupCustomers.length > 0
      ? metrics.readyPickupCustomers.slice(0, 2).join(' & ')
      : 'Belum ada';

  return (
    <div className="metrics-grid">
      {/* Card 1: Pesanan hari ini */}
      <div className="card metric-card">
        <div className="metric-header">
          <span className="metric-title">Pesanan hari ini</span>
          <div className="icon-badge">
            <FileText size={17} />
          </div>
        </div>
        <div className="metric-value">{metrics.todayOrdersCount}</div>
        <div className="metric-footer">{metrics.pendingPickupCount} belum diambil</div>
      </div>

      {/* Card 2: Berat cucian */}
      <div className="card metric-card">
        <div className="metric-header">
          <span className="metric-title">Berat cucian</span>
          <div className="icon-badge">
            <ShoppingBag size={17} />
          </div>
        </div>
        <div className="metric-value">{metrics.totalWeight} kg</div>
        <div className="metric-footer">{metrics.serviceTypesCount} jenis layanan</div>
      </div>

      {/* Card 3: Pembayaran masuk */}
      <div className="card metric-card">
        <div className="metric-header">
          <span className="metric-title">Pembayaran masuk</span>
          <div className="icon-badge">
            <Wallet size={17} />
          </div>
        </div>
        <div className="metric-value">
          Rp{metrics.incomingPayment.toLocaleString('id-ID')}
        </div>
        <div className="metric-footer">{metrics.paidOrdersCount} pesanan lunas</div>
      </div>

      {/* Card 4: Siap diambil */}
      <div className="card metric-card">
        <div className="metric-header">
          <span className="metric-title">Siap diambil</span>
          <div className="icon-badge">
            <Package size={17} />
          </div>
        </div>
        <div className="metric-value">{metrics.readyPickupCount}</div>
        <div className="metric-footer">{readyNames}</div>
      </div>

      <style jsx>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .metric-card {
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .metric-title {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
        }

        .icon-badge {
          color: #0d9488;
        }

        .metric-value {
          font-size: 30px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .metric-footer {
          margin-top: 10px;
          font-size: 12.5px;
          color: #64748b;
        }

        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
