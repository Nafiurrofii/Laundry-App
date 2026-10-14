'use client';

import React from 'react';
import { Droplet, Sparkles, Shirt, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { MaterialResultItem } from './types';

interface HasilKebutuhanCardsProps {
  results: MaterialResultItem[];
  weightKg: number;
}

export const HasilKebutuhanCards: React.FC<HasilKebutuhanCardsProps> = ({
  results,
  weightKg,
}) => {
  return (
    <div className="hasil-cards-container">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">
            Hasil Prediksi Kebutuhan Bahan ({weightKg} kg Cucian)
          </h3>
          <p className="section-subtitle">
            Takaran akurat bahan baku cair dalam satuan mililiter (ml) dan kemasan
          </p>
        </div>
      </div>

      <div className="cards-grid">
        {results.map((item) => {
          const isSoap = item.category === 'Deterjen';
          const isPerfume = item.category === 'Parfum';
          const isSoftener = item.category === 'Softener';

          const IconComp = isSoap
            ? Droplet
            : isPerfume
            ? Sparkles
            : isSoftener
            ? Shirt
            : Package;

          return (
            <div
              key={item.id}
              className={`card material-res-card ${
                !item.isSufficient && item.totalNeeded > 0 ? 'card-warning' : ''
              }`}
            >
              <div className="card-top">
                <div className="title-wrap">
                  <span className="cat-label">{item.category}</span>
                  <h4 className="item-name">{item.name}</h4>
                </div>
                <div className={`icon-circle cat-${item.category.toLowerCase()}`}>
                  <IconComp size={18} />
                </div>
              </div>

              {/* Main Volume Output in ML */}
              <div className="output-volume-box">
                <div className="volume-number">
                  {item.totalNeeded.toLocaleString('id-ID')}
                  <span className="unit-label"> {item.unit}</span>
                </div>
                {item.unit === 'ml' && (
                  <div className="liter-sub">
                    setara {(item.totalNeeded / 1000).toFixed(2)} Liter
                  </div>
                )}
              </div>

              {/* Takaran per kg */}
              <div className="dose-info-row">
                <span className="dose-label">Rasio Takaran:</span>
                <span className="dose-val">
                  {item.dosePerKg} {item.unit} / kg
                </span>
              </div>

              {/* Stock Comparison */}
              <div className="stock-info-box">
                <div className="stock-row">
                  <span className="stock-lbl">Sisa Stok Outlet:</span>
                  <span className="stock-val">{item.stockUnit}</span>
                </div>

                <div className="stock-status-row">
                  {item.isSufficient ? (
                    <span className="status-badge status-ok">
                      <CheckCircle2 size={13} />
                      <span>Stok Cukup</span>
                    </span>
                  ) : (
                    <span className="status-badge status-danger">
                      <AlertCircle size={13} />
                      <span>Kurang {item.deficit.toLocaleString('id-ID')} {item.unit}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .hasil-cards-container {
          margin-bottom: 24px;
        }

        .section-header-row {
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
        }

        .section-subtitle {
          font-size: 13px;
          color: #64748b;
          margin-top: 2px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .material-res-card {
          padding: 22px 20px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-light);
          position: relative;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .material-res-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .card-warning {
          border-color: #fdba74;
          background-color: #fffaf5;
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
        }

        .cat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #0d9488;
          text-transform: uppercase;
        }

        .item-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin-top: 2px;
          line-height: 1.3;
        }

        .icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cat-deterjen {
          background-color: #e0f2fe;
          color: #0284c7;
        }

        .cat-parfum {
          background-color: #fdf2f8;
          color: #db2777;
        }

        .cat-softener {
          background-color: #f0fdf4;
          color: #16a34a;
        }

        .cat-kemasan {
          background-color: #fef3c7;
          color: #d97706;
        }

        .output-volume-box {
          background-color: #f8fafc;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          margin-bottom: 14px;
        }

        .volume-number {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .unit-label {
          font-size: 16px;
          font-weight: 700;
          color: #0d9488;
        }

        .liter-sub {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
          font-weight: 500;
        }

        .dose-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed var(--border-light);
        }

        .dose-label {
          color: #64748b;
        }

        .dose-val {
          font-weight: 700;
          color: #1e293b;
        }

        .stock-info-box {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stock-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
        }

        .stock-lbl {
          color: #64748b;
        }

        .stock-val {
          font-weight: 600;
          color: #0f172a;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          width: fit-content;
        }

        .status-ok {
          background-color: #dcfce7;
          color: #15803d;
        }

        .status-danger {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
