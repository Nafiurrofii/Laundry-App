'use client';

import React from 'react';
import { FlaskConical, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { usePrediksiViewModel } from './hooks/usePrediksiViewModel';
import { KalkulatorFormCard } from './KalkulatorFormCard';
import { HasilKebutuhanCards } from './HasilKebutuhanCards';
import { TabelRincianBahan } from './TabelRincianBahan';
import { MLPredictionCard } from './MLPredictionCard';

export const PrediksiView: React.FC = () => {
  const {
    input,
    results,
    todayWeight,
    totalEstimatedCost,
    hasInsufficientStock,
    hasCalculated,
    committedInput,
    mlState,
    retryMLPrediction,
    handleHitung,
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
            berdasarkan berat cucian yang diinputkan — didukung model Machine Learning.
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
        isLoading={mlState.isLoading}
        onWeightChange={handleWeightChange}
        onServiceChange={handleServiceChange}
        onIntensityChange={handleIntensityChange}
        onVariantChange={handleVariantChange}
        onApplyPreset={applyPresetWeight}
        onHitung={handleHitung}
      />

      {/* ── Empty state sebelum tombol Hitung diklik ────────────── */}
      {!hasCalculated && (
        <div className="empty-state-card">
          <div className="empty-icon-wrap">
            <FlaskConical size={36} className="empty-icon" />
          </div>
          <h3 className="empty-title">Siap Menghitung</h3>
          <p className="empty-desc">
            Isi berat cucian dan preferensi di atas, lalu klik{' '}
            <strong>Hitung Prediksi</strong> untuk melihat hasil kebutuhan bahan baku dari
            model Machine Learning dan kalkulasi standar operasional.
          </p>
        </div>
      )}

      {/* ── ML Prediction Card (Python Random Forest API) ──────── */}
      {hasCalculated && (
        <MLPredictionCard
          weightKg={committedInput?.weightKg ?? input.weightKg}
          mlState={mlState}
          onRetry={retryMLPrediction}
        />
      )}

      {/* 4 Cards Hasil Takaran dalam ML (rule-based) */}
      {hasCalculated && results.length > 0 && (
        <HasilKebutuhanCards results={results} weightKg={committedInput?.weightKg ?? input.weightKg} />
      )}

      {/* Tabel Rincian & Estimasi Biaya */}
      {hasCalculated && results.length > 0 && (
        <TabelRincianBahan
          results={results}
          weightKg={committedInput?.weightKg ?? input.weightKg}
          totalCost={totalEstimatedCost}
        />
      )}

      {/* Card Info Edukasi Standar Takaran Operasional */}
      {hasCalculated && (
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
      )}

      <div className="page-footer-note">
        Risky Laundry • Sistem Prediksi Operasional dengan Machine Learning, 8 Oktober 2026
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

        /* Empty state */
        .empty-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 48px 32px;
          margin-bottom: 24px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: var(--radius-lg, 16px);
          gap: 12px;
        }

        .empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, #e6f7f5 0%, #e0f2fe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .empty-icon {
          color: #0d9488;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }

        .empty-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.6;
          max-width: 460px;
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
