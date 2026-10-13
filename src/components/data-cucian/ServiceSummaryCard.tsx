'use client';

import React from 'react';
import { ServiceSummaryItem } from './types';

interface ServiceSummaryCardProps {
  summaries: ServiceSummaryItem[];
}

export const ServiceSummaryCard: React.FC<ServiceSummaryCardProps> = ({ summaries }) => {
  return (
    <div className="card summary-card">
      <div className="summary-header">
        <h3 className="section-title">Ringkasan layanan</h3>
        <p className="section-subtitle">
          Komposisi cucian pada periode yang dipilih
        </p>
      </div>

      <div className="services-grid">
        {summaries.map((item, idx) => (
          <div key={idx} className="service-col-box">
            <h4 className="service-name">{item.serviceName}</h4>
            <div className="service-meta-row">
              <span className="order-count">{item.orderCount} pesanan</span>
              <span className="weight-val">{item.totalWeight} kg</span>
            </div>
            <div className="service-value-row">
              <span className="value-label">Nilai pesanan</span>
              <span className="value-price">
                Rp{item.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .summary-card {
          padding: 24px;
          background: #ffffff;
        }

        .summary-header {
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

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .service-col-box {
          background-color: #f8fafc;
          border-radius: var(--radius-md);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
        }

        .service-name {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .service-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 14px;
        }

        .weight-val {
          font-weight: 700;
          color: #1e293b;
        }

        .service-value-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
        }

        .value-label {
          font-size: 12px;
          color: #64748b;
        }

        .value-price {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
