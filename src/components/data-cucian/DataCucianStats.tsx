'use client';

import React from 'react';
import { Layers, ShoppingBag, Sparkles, Package } from 'lucide-react';
import { DataCucianStats as StatsType } from './types';

interface DataCucianStatsProps {
  stats: StatsType;
}

export const DataCucianStats: React.FC<DataCucianStatsProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="card stat-card">
        <div className="stat-header">
          <span className="stat-title">Total pesanan</span>
          <Layers size={17} className="stat-icon" />
        </div>
        <div className="stat-value">{stats.totalOrders}</div>
        <div className="stat-desc">8 Oktober 2026</div>
      </div>

      <div className="card stat-card">
        <div className="stat-header">
          <span className="stat-title">Total berat</span>
          <ShoppingBag size={17} className="stat-icon" />
        </div>
        <div className="stat-value">{stats.totalWeight} kg</div>
        <div className="stat-desc">Seluruh pesanan</div>
      </div>

      <div className="card stat-card">
        <div className="stat-header">
          <span className="stat-title">Dalam proses</span>
          <Sparkles size={17} className="stat-icon" />
        </div>
        <div className="stat-value">{stats.inProgressCount}</div>
        <div className="stat-desc">Diterima, cuci, setrika</div>
      </div>

      <div className="card stat-card">
        <div className="stat-header">
          <span className="stat-title">Siap diambil</span>
          <Package size={17} className="stat-icon" />
        </div>
        <div className="stat-value">{stats.readyPickupCount}</div>
        <div className="stat-desc">Menunggu pelanggan</div>
      </div>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .stat-card {
          padding: 20px 22px;
          background: #ffffff;
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .stat-title {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
        }

        .stat-icon {
          color: #0d9488;
        }

        .stat-value {
          font-size: 30px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .stat-desc {
          margin-top: 10px;
          font-size: 12.5px;
          color: #64748b;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
