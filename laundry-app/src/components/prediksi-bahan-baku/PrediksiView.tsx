'use client';

import React from 'react';
import { FlaskConical, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { usePrediksiViewModel } from './hooks/usePrediksiViewModel';
import { KalkulatorFormCard } from './KalkulatorFormCard';
import { HasilKebutuhanCards } from './HasilKebutuhanCards';
import { TabelRincianBahan } from './TabelRincianBahan';

export const PrediksiView: React.FC = () => {
  const {
    input,
    results,
    todayWeight,
    totalEstimatedCost,
    hasInsufficientStock,
    handleWeightChange,
    handleServiceChange,
    handleIntensityChange,
    handleVariantChange,
    applyPresetWeight,
  } = usePrediksiViewModel();

  return (
    <div className="prediksi-view">
      {/* Header */}
      <div className="prediksi-header">
        <div className="header-meta">
          <div className="badge-tag">
            <FlaskConical size={14} />
            <span>Kalkulator Takaran Bahan Baku Laundry</span>
          </div>
          <h1 className="page-title">Prediksi Kebutuhan Bahan Baku</h1>
          <p className="page-subtitle">
            Hitung takaran sabun (ml), parfum (ml), dan pelembut (ml) secara presisi
            berdasarkan berat cucian yang diinputkan.
          </p>
        </div>
      </div>

      {/* Alert Banner jika ada stok yang kurang */}
      {hasInsufficientStock && (
        <div className="stock-warning-banner">
          <AlertTriangle size={18} className="warn-icon" />
          <p className="warn-text">
            <strong>Perhatian:</strong> Sisa stok bahan baku di outlet tidak mencukupi untuk
            mengerjakan {input.weightKg} kg cucian ini. Harap segera melakukan pembelian / restok.
          </p>
        </div>
      )}

      {/* Form Input Berat Cucian (kg) */}
      <KalkulatorFormCard
        input={input}
        todayWeight={todayWeight}
        onWeightChange={handleWeightChange}
        onServiceChange={handleServiceChange}
        onIntensityChange={handleIntensityChange}
        onVariantChange={handleVariantChange}
        onApplyPreset={applyPresetWeight}
      />

      {/* 4 Cards Hasil Takaran dalam ML */}
      <HasilKebutuhanCards results={results} weightKg={input.weightKg} />

      {/* Tabel Rincian & Estimasi Biaya */}
      <TabelRincianBahan
        results={results}
        weightKg={input.weightKg}
        totalCost={totalEstimatedCost}
      />

      {/* Card Info Edukasi Standar Takaran Operasional */}
      <div className="card guide-card">
        <div className="guide-header">
          <Info size={17} className="info-icon" />
          <h4 className="guide-title">Standar Takaran Operasional Bilas Laundry</h4>
        </div>
        <div className="guide-grid">
          <div className="guide-item">
            <span className="item-name">Sabun / Deterjen:</span>
            <span className="item-val">25 ml per 1 kg pakaian</span>
          </div>
          <div className="guide-item">
            <span className="item-name">Parfum Laundry:</span>
            <span className="item-val">10 ml per 1 kg pakaian (Finishing)</span>
          </div>
          <div className="guide-item">
            <span className="item-name">Pelembut (Softener):</span>
            <span className="item-val">20 ml per 1 kg pakaian</span>
          </div>
          <div className="guide-item">
            <span className="item-name">Kemasan Plastik:</span>
            <span className="item-val">1 lembar per 4-5 kg pakaian</span>
          </div>
        </div>
      </div>

      <div className="page-footer-note">
        Risky Laundry • Sistem Prediksi Operasional, 8 Oktober 2026
      </div>

      <style jsx>{`
        .prediksi-view {
          display: flex;
          flex-direction: column;
        }

        .prediksi-header {
          margin-bottom: 24px;
        }

        .badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #e6f7f5;
          color: #0f766e;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 8px;
        }

        .stock-warning-banner {
          background-color: #fff7ed;
          border: 1px solid #ffedd5;
          border-left: 4px solid #ea580c;
          border-radius: var(--radius-md);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .warn-icon {
          color: #ea580c;
          flex-shrink: 0;
        }

        .warn-text {
          font-size: 13px;
          color: #9a3412;
          line-height: 1.4;
        }

        .guide-card {
          background-color: #f8fafc;
          padding: 20px 24px;
          border: 1px solid var(--border-light);
          margin-bottom: 20px;
        }

        .guide-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .info-icon {
          color: #0d9488;
        }

        .guide-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .guide-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .guide-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12.5px;
        }

        .item-name {
          color: #64748b;
        }

        .item-val {
          font-weight: 700;
          color: #0f172a;
        }

        .page-footer-note {
          margin-top: 16px;
          font-size: 12px;
          color: #94a3b8;
        }

        @media (max-width: 900px) {
          .guide-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
