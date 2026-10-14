'use client';

import React from 'react';
import { ServiceCompositionItem } from './types';

interface ServiceCompositionBarsProps {
  composition: ServiceCompositionItem[];
  totalWeight: number;
}

export const ServiceCompositionBars: React.FC<ServiceCompositionBarsProps> = ({
  composition,
  totalWeight,
}) => {
  return (
    <div className="card comp-card">
      <div className="comp-header">
        <h3 className="section-title">Komposisi layanan</h3>
        <p className="section-subtitle">Berdasarkan berat cucian hari ini</p>
      </div>

      <div className="bars-list">
        {composition.map((item, idx) => (
          <div key={idx} className="bar-row-item">
            <div className="item-top">
              <span className="svc-name">{item.serviceName}</span>
              <span className="svc-weight">{item.weight} kg</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>

            <div className="item-percent">
              {item.percentage.toString().replace('.', ',')}% dari total {totalWeight} kg
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .comp-card {
          padding: 24px;
          background: #ffffff;
        }

        .comp-header {
          margin-bottom: 22px;
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

        .bars-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
          margin-bottom: 8px;
        }

        .svc-name {
          color: #1e293b;
          font-weight: 600;
        }

        .svc-weight {
          color: #0f172a;
          font-weight: 700;
        }

        .progress-track {
          width: 100%;
          height: 8px;
          background-color: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #0d9488;
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        .item-percent {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};
