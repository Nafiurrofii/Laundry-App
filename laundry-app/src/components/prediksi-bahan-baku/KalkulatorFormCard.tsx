'use client';

import React from 'react';
import { Scale, Sparkles, SlidersHorizontal, Droplet, Loader2, FlaskConical } from 'lucide-react';
import {
  ServiceTypeOption,
  FragranceIntensity,
  PredictionInput,
} from './types';

interface KalkulatorFormCardProps {
  input: PredictionInput;
  todayWeight: number;
  isLoading: boolean;
  onWeightChange: (val: number) => void;
  onServiceChange: (service: ServiceTypeOption) => void;
  onIntensityChange: (intensity: FragranceIntensity) => void;
  onVariantChange: (variant: string) => void;
  onApplyPreset: (kg: number) => void;
  onHitung: () => void;
}

export const KalkulatorFormCard: React.FC<KalkulatorFormCardProps> = ({
  input,
  todayWeight,
  isLoading,
  onWeightChange,
  onServiceChange,
  onIntensityChange,
  onVariantChange,
  onApplyPreset,
  onHitung,
}) => {
  return (
    <div className="card kalkulator-card">
      <div className="card-header">
        <div className="header-title-wrap">
          <div className="icon-badge">
            <Scale size={20} />
          </div>
          <div>
            <h3 className="section-title">Kalkulator Kebutuhan Bahan Baku</h3>
            <p className="section-subtitle">
              Input berat cucian untuk menghitung kebutuhan sabun (ml), parfum (ml), dan bahan lainnya.
            </p>
          </div>
        </div>
      </div>

      <div className="form-body">
        {/* Input Berat Cucian (kg) */}
        <div className="form-group">
          <div className="label-row">
            <label className="form-label">
              Berat Cucian (Kilogram) <span className="text-required">*</span>
            </label>
            <span className="current-kg-display">{input.weightKg} kg</span>
          </div>

          <div className="input-with-addon">
            <input
              type="number"
              min="0.5"
              step="0.5"
              className="kg-input"
              value={input.weightKg || ''}
              onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
              placeholder="Masukkan berat dalam kg..."
            />
            <div className="unit-addon">kg</div>
          </div>

          {/* Quick Presets */}
          <div className="preset-chips">
            <span className="preset-label">Pilihan Cepat:</span>
            <button
              type="button"
              className={`chip-btn ${input.weightKg === todayWeight ? 'active-chip' : ''}`}
              onClick={() => onApplyPreset(todayWeight)}
            >
              <Sparkles size={13} />
              <span>Hari Ini ({todayWeight} kg)</span>
            </button>
            <button
              type="button"
              className={`chip-btn ${input.weightKg === 5 ? 'active-chip' : ''}`}
              onClick={() => onApplyPreset(5)}
            >
              5 kg
            </button>
            <button
              type="button"
              className={`chip-btn ${input.weightKg === 10 ? 'active-chip' : ''}`}
              onClick={() => onApplyPreset(10)}
            >
              10 kg
            </button>
            <button
              type="button"
              className={`chip-btn ${input.weightKg === 20 ? 'active-chip' : ''}`}
              onClick={() => onApplyPreset(20)}
            >
              20 kg
            </button>
            <button
              type="button"
              className={`chip-btn ${input.weightKg === 50 ? 'active-chip' : ''}`}
              onClick={() => onApplyPreset(50)}
            >
              50 kg
            </button>
          </div>
        </div>

        {/* 2 Kolom Pilihan: Jenis Layanan & Aroma Parfum */}
        <div className="options-grid">
          {/* Jenis Layanan */}
          <div className="form-group">
            <label className="form-label">Jenis Layanan Cucian</label>
            <select
              className="form-select"
              value={input.serviceType}
              onChange={(e) => onServiceChange(e.target.value as ServiceTypeOption)}
            >
              <option value="Cuci Setrika">Cuci Setrika (Sabun + Softener + Parfum + Packing)</option>
              <option value="Cuci Kering">Cuci Kering (Sabun + Softener + Parfum)</option>
              <option value="Cuci Basah">Cuci Basah (Hanya Sabun Deterjen)</option>
              <option value="Semua Layanan">Semua Layanan (Rata-rata Gabungan)</option>
            </select>
          </div>

          {/* Varian Aroma Parfum */}
          <div className="form-group">
            <label className="form-label">Aroma / Varian Parfum</label>
            <select
              className="form-select"
              value={input.fragranceVariant}
              onChange={(e) => onVariantChange(e.target.value)}
              disabled={input.serviceType === 'Cuci Basah'}
            >
              <option value="Snappy Fresh">Snappy Fresh (Aroma Segar Favorit)</option>
              <option value="Lavender Soft">Lavender Soft (Aroma Lembut Menenangkan)</option>
              <option value="Ocean Breeze">Ocean Breeze (Aroma Laut Menyegarkan)</option>
              <option value="Sakura Blossom">Sakura Blossom (Aroma Floral Manis)</option>
            </select>
          </div>
        </div>

        {/* Intensitas Parfum */}
        {input.serviceType !== 'Cuci Basah' && (
          <div className="form-group intensity-group">
            <label className="form-label">Takaran Intensitas Parfum</label>
            <div className="intensity-buttons">
              <button
                type="button"
                className={`intensity-btn ${input.intensity === 'Hemat' ? 'active' : ''}`}
                onClick={() => onIntensityChange('Hemat')}
              >
                <span className="int-title">Hemat</span>
                <span className="int-sub">7 ml / kg</span>
              </button>
              <button
                type="button"
                className={`intensity-btn ${input.intensity === 'Standar' ? 'active' : ''}`}
                onClick={() => onIntensityChange('Standar')}
              >
                <span className="int-title">Standar (Rekomendasi)</span>
                <span className="int-sub">10 ml / kg</span>
              </button>
              <button
                type="button"
                className={`intensity-btn ${input.intensity === 'Ekstra Wangi' ? 'active' : ''}`}
                onClick={() => onIntensityChange('Ekstra Wangi')}
              >
                <span className="int-title">Ekstra Wangi</span>
                <span className="int-sub">13 ml / kg</span>
              </button>
            </div>
          </div>
        )}

        {/* Tombol Hitung */}
        <div className="hitung-action-row">
          <button
            id="btn-hitung-prediksi"
            type="button"
            className={`btn-hitung ${isLoading ? 'btn-hitung-loading' : ''}`}
            onClick={onHitung}
            disabled={isLoading || input.weightKg <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Menghitung...</span>
              </>
            ) : (
              <>
                <FlaskConical size={18} />
                <span>Hitung Prediksi</span>
              </>
            )}
          </button>
          <p className="hitung-hint">
            Klik untuk menghitung kebutuhan bahan baku berdasarkan input di atas
          </p>
        </div>
      </div>

      <style jsx>{`
        .kalkulator-card {
          padding: 24px;
          background: #ffffff;
          margin-bottom: 24px;
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background-color: #e6f7f5;
          color: #0d9488;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .current-kg-display {
          font-size: 14px;
          font-weight: 700;
          color: #0d9488;
          background-color: #f0fdfa;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .text-required {
          color: #ef4444;
        }

        .input-with-addon {
          display: flex;
          align-items: center;
          position: relative;
        }

        .kg-input {
          width: 100%;
          font-size: 20px;
          font-weight: 700;
          padding: 12px 64px 12px 16px;
          border: 2px solid var(--border-light);
          border-radius: var(--radius-md);
          color: #0f172a;
          outline: none;
          transition: all 0.15s ease;
        }

        .kg-input:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }

        .unit-addon {
          position: absolute;
          right: 18px;
          font-size: 15px;
          font-weight: 700;
          color: #64748b;
          pointer-events: none;
        }

        .preset-chips {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .preset-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          transition: all 0.15s ease;
        }

        .chip-btn:hover {
          background-color: #e2e8f0;
          color: #0f172a;
        }

        .chip-btn.active-chip {
          background-color: #0d9488;
          color: #ffffff;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 16px;
          margin-top: 18px;
        }

        .intensity-group {
          margin-top: 14px;
        }

        .intensity-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .intensity-btn {
          padding: 10px 14px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: #ffffff;
          transition: all 0.15s ease;
        }

        .intensity-btn:hover {
          border-color: #cbd5e1;
          background: #fafbfd;
        }

        .intensity-btn.active {
          border-color: #0d9488;
          background: #f0fdfa;
        }

        .intensity-btn.active .int-title {
          color: #0d9488;
        }

        .intensity-btn.active .int-title {
          color: #0d9488;
        }

        .int-title {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .int-sub {
          font-size: 11px;
          color: #64748b;
        }

        /* Tombol Hitung */
        .hitung-action-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px dashed var(--border-light);
        }

        .btn-hitung {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 32px;
          border-radius: var(--radius-md);
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-hitung:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.45);
          background: linear-gradient(135deg, #0f766e 0%, #0e7490 100%);
        }

        .btn-hitung:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-hitung:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-hitung-loading {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          box-shadow: none;
        }

        .hitung-hint {
          font-size: 12.5px;
          color: #94a3b8;
          line-height: 1.5;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .options-grid {
            grid-template-columns: 1fr;
          }
          .intensity-buttons {
            grid-template-columns: 1fr;
          }
          .hitung-action-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn-hitung {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
