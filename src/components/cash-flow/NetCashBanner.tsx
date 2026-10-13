'use client';

import React from 'react';
import { CashFlowSummary } from './types';

interface NetCashBannerProps {
  summary: CashFlowSummary;
}

export const NetCashBanner: React.FC<NetCashBannerProps> = ({ summary }) => {
  const isPositive = summary.netCash >= 0;
  const sign = isPositive ? '+' : '-';
  const absNet = Math.abs(summary.netCash);

  return (
    <div className="net-cash-banner">
      <div className="banner-inner">
        <div className="banner-left">
          <div className="banner-label">ARUS KAS BERSIH HARI INI</div>
          <div className="banner-amount">
            {sign}Rp{absNet.toLocaleString('id-ID')}
          </div>
          <div className="banner-formula">
            Rp{summary.totalIncome.toLocaleString('id-ID')} kas masuk – Rp
            {summary.totalExpense.toLocaleString('id-ID')} kas keluar
          </div>
        </div>

        <div className="banner-right">
          <span className="cash-status-pill">
            {isPositive ? 'Arus kas positif' : 'Arus kas defisit'}
          </span>
        </div>
      </div>

      <style jsx>{`
        .net-cash-banner {
          background-color: #164039;
          border-radius: var(--radius-lg);
          padding: 24px 28px;
          color: #ffffff;
          margin-bottom: 24px;
        }

        .banner-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .banner-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #a7f3d0;
          margin-bottom: 6px;
        }

        .banner-amount {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .banner-formula {
          font-size: 12.5px;
          color: #cbd5e1;
          margin-top: 8px;
        }

        .cash-status-pill {
          background-color: #d1fae5;
          color: #065f46;
          font-size: 12.5px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};
