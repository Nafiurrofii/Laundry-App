'use client';

import React, { useState, useEffect, useId } from 'react';
import {
  Scale,
  Droplets,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const PrediksiView: React.FC = () => {
  const [weight, setWeight] = useState<number>(10);
  const [weightInputStr, setWeightInputStr] = useState<string>('10');
  const weightInputId = useId();

  // ML API status & prediction (FastAPI Python)
  const [mlStatus, setMlStatus] = useState<'idle' | 'loading' | 'connected' | 'offline'>('idle');
  const [mlPrediction, setMlPrediction] = useState<{ sabun?: number; parfum?: number } | null>(null);

  const [committedWeight, setCommittedWeight] = useState<number>(10);

  // Standard coefficients per kg (from the mockup)
  const COEFF_SABUN = 20; // ml per kg
  const COEFF_PARFUM = 5; // ml per kg

  // Calculated values based on committedWeight
  const sabunStandard = Math.round(committedWeight * COEFF_SABUN);
  const parfumStandard = Math.round(committedWeight * COEFF_PARFUM * 10) / 10;

  // Query Python API if available
  const fetchPrediction = async (kg: number) => {
    if (kg <= 0) return;
    setMlStatus('loading');
    try {
      const res = await fetch('/api/prediksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kg }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prediksi) {
          setMlPrediction({
            sabun: data.prediksi.sabun,
            parfum: data.prediksi.parfum,
          });
          setMlStatus('connected');
          return;
        }
      }
      setMlStatus('offline');
    } catch {
      setMlStatus('offline');
    }
  };

  useEffect(() => {
    fetchPrediction(committedWeight);
  }, []);

  const handleHitung = () => {
    const parsed = parseFloat(weightInputStr);
    let targetKg = !isNaN(parsed) && parsed > 0 ? parsed : 10;
    if (targetKg > 10) {
      targetKg = 10;
      setWeightInputStr('10');
    }
    setWeight(targetKg);
    setCommittedWeight(targetKg);
    fetchPrediction(targetKg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleHitung();
    }
  };

  const handleWeightChange = (valStr: string) => {
    setWeightInputStr(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed > 0) {
      setWeight(parsed);
    }
  };

  const sabunDisplay =
    mlStatus === 'connected' && mlPrediction?.sabun != null
      ? Math.round(mlPrediction.sabun)
      : sabunStandard;

  const parfumDisplay =
    mlStatus === 'connected' && mlPrediction?.parfum != null
      ? mlPrediction.parfum
      : parfumStandard;

  return (
    <div className="prediksi-desktop-layout">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="page-header-row">
        <h1 className="page-title">Prediksi bahan baku</h1>
        <p className="page-subtitle">
          Perkiraan kebutuhan sabun dan parfum berdasarkan berat pakaian.
        </p>

        <div className="example-calc-tag-row">
          <span className="example-calc-badge">Contoh perhitungan</span>
          <span className="example-calc-text">
            Berat pakaian: {committedWeight} kg × 1 kali kuota akumulasi
          </span>
          {mlStatus === 'connected' && (
            <span className="ml-badge-online">Model ML Terhubung</span>
          )}
        </div>
      </div>

      {/* ── Main Two-Column Grid ──────────────────────────────── */}
      <div className="desktop-grid-two-col">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="col-stack">
          {/* Card 1: Berat Pakaian */}
          <div className="card app-card">
            <div className="card-header-block">
              <div className="card-title-flex">
                <h2 className="card-title">Berat pakaian</h2>
                <span className="card-max-pill">Maksimal 10 kg</span>
              </div>
              <p className="card-desc">
                Masukkan total berat cucian yang akan diproses (maksimal 10 kg).
              </p>
            </div>

            <div className="form-group-field">
              <label htmlFor={weightInputId} className="field-label">Berat pakaian (kg)</label>
              <div className="weight-input-box">
                <Scale size={20} className="input-scale-icon" />
                <input
                  id={weightInputId}
                  type="number"
                  value={weightInputStr}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="weight-input-element"
                  min="0.1"
                  max="10"
                  step="0.5"
                  placeholder="10"
                />
                <span className="input-unit-label">kg</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleHitung}
              disabled={mlStatus === 'loading'}
              className="btn-hitung-prediksi"
            >
              {mlStatus === 'loading' ? (
                <>
                  <RefreshCw size={17} className="spin-icon" />
                  <span>Menghitung...</span>
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  <span>Hitung Prediksi</span>
                </>
              )}
            </button>

            {weight > 10 ? (
              <div className="card-helper-status">
                <div className="status-badge-line">
                  <AlertCircle size={16} className="check-icon-warn" />
                  <span className="status-text-warn">
                    Maksimal kapasitas cucian adalah 10 kg
                  </span>
                </div>
                <p className="status-subtext">
                  Kapasitas mesin per siklus dibatasi maksimal 10 kg. Silakan gunakan angka antara 0.1 - 10 kg.
                </p>
              </div>
            ) : (
              <div className="card-helper-status">
                <div className="status-badge-line">
                  <CheckCircle2 size={16} className="check-icon-teal" />
                  <span className="status-text-teal">
                    Berat cucian 1 kali cuci {committedWeight} kg
                  </span>
                </div>
                <p className="status-subtext">
                  Hasil diperbarui berdasarkan berat yang Anda masukkan. Gunakan angka positif (maksimal 10 kg), misalnya 10 atau 8,5.
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Koefisien Contoh */}
          <div className="card app-card">
            <div className="card-header-block">
              <h2 className="card-title">Koefisien contoh</h2>
              <p className="card-desc">Takaran per 1 kilogram pakaian</p>
            </div>

            <div className="coeff-items-stack">
              <div className="coeff-item-row">
                <div className="coeff-left-wrap">
                  <div className="coeff-icon-container">
                    <Droplets size={18} />
                  </div>
                  <span className="coeff-item-name">Sabun</span>
                </div>
                <span className="coeff-item-rate">{COEFF_SABUN} ml/kg</span>
              </div>

              <div className="coeff-item-row">
                <div className="coeff-left-wrap">
                  <div className="coeff-icon-container">
                    <Sparkles size={18} />
                  </div>
                  <span className="coeff-item-name">Parfum</span>
                </div>
                <span className="coeff-item-rate">{COEFF_PARFUM} ml/kg</span>
              </div>
            </div>

            <p className="coeff-footnote-text">
              Koefisien dapat disesuaikan dengan produk dan standar laundry Anda.
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────── */}
        <div className="col-stack">
          {/* Card 3: Estimasi Kebutuhan (Soft Mint/Teal Container) */}
          <div className="card app-card featured-mint-card">
            <div className="card-header-block">
              <h2 className="card-title">Estimasi kebutuhan</h2>
              <p className="card-desc">Hasil untuk {committedWeight} kg pakaian</p>
            </div>

            <div className="white-subcards-grid">
              {/* White Subcard Sabun */}
              <div className="white-subcard">
                <div className="subcard-header-row">
                  <div className="subcard-icon-round">
                    <Droplets size={16} />
                  </div>
                  <span className="subcard-title-text">Sabun</span>
                </div>
                <div className="subcard-number-wrapper">
                  <span className="subcard-big-value">{sabunDisplay}</span>
                  <span className="subcard-unit-text">ml</span>
                </div>
                <span className="subcard-calc-formula">
                  {committedWeight} kg × {COEFF_SABUN} ml/kg
                </span>
              </div>

              {/* White Subcard Parfum */}
              <div className="white-subcard">
                <div className="subcard-header-row">
                  <div className="subcard-icon-round">
                    <Sparkles size={16} />
                  </div>
                  <span className="subcard-title-text">Parfum</span>
                </div>
                <div className="subcard-number-wrapper">
                  <span className="subcard-big-value">{parfumDisplay}</span>
                  <span className="subcard-unit-text">ml</span>
                </div>
                <span className="subcard-calc-formula">
                  {committedWeight} kg × {COEFF_PARFUM} ml/kg
                </span>
              </div>
            </div>

            <div className="featured-card-bottom-line">
              <CheckCircle2 size={16} className="featured-bottom-icon" />
              <span className="featured-bottom-text">
                Jika berat berubah, kebutuhan bahan mengikuti koefisien per kg yang digunakan.
              </span>
            </div>
          </div>

          {/* Card 4: Cara Membaca Hasil */}
          <div className="card app-card">
            <div className="card-header-block">
              <h2 className="card-title">Cara membaca hasil</h2>
            </div>

            <div className="formula-summary-flex">
              <span className="formula-label-muted">Rumus</span>
              <span className="formula-val-bold">Berat × Koefisien</span>
            </div>

            <div className="horizontal-divider" />

            <p className="formula-desc-text">
              Untuk {committedWeight} kg pakaian, standar takaran {COEFF_SABUN} ml/kg menghasilkan {sabunStandard} ml sabun. Takaran parfum {COEFF_PARFUM} ml/kg menghasilkan {parfumStandard} ml parfum.
            </p>
          </div>
        </div>
      </div>

      {/* ── Full Width Amber Callout ───────────────────────────── */}
      <div className="card amber-callout-card">
        <div className="amber-title-row">
          <AlertCircle size={20} className="amber-icon" />
          <h3 className="amber-title">
            Takaran adalah asumsi, bukan standar operasional.
          </h3>
        </div>

        <p className="amber-text">
          Koefisien sabun 20 ml/kg dan parfum 5 ml/kg hanya contoh yang dapat disesuaikan. Kebutuhan nyata tergantung konsentrasi produk, jenis mesin, dan kondisi cucian. Ikuti petunjuk produk dan uji takaran terlebih dahulu.
        </p>

        <p className="amber-text-note">
          Catatan: Nilai ini mengasumsikan satu pemakaian untuk total {committedWeight} kg.
        </p>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="desktop-page-footer">
        Risky Laundry • Data contoh, 4 Oktober 2026
      </footer>

      {/* ── Component Styling ─────────────────────────────────── */}
      <style jsx>{`
        .prediksi-desktop-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          color: #0f172a;
        }

        /* ── Page Header ─────────────────────────────────────── */
        .page-header-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .page-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f2933;
          letter-spacing: -0.4px;
          margin: 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .example-calc-tag-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .example-calc-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 9999px;
          background: #e6f7f5;
          color: #0d9488;
          font-size: 12px;
          font-weight: 700;
        }

        .example-calc-text {
          font-size: 13px;
          color: #475569;
        }

        .ml-badge-online {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        /* ── Grid 2 Kolom ─────────────────────────────────────── */
        .desktop-grid-two-col {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 24px;
          align-items: start;
        }

        .col-stack {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Cards General ───────────────────────────────────── */
        .app-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .card-header-block {
          margin-bottom: 18px;
        }

        .card-title-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .card-max-pill {
          display: inline-flex;
          align-items: center;
          font-size: 11.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
          letter-spacing: -0.2px;
        }

        .card-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f2933;
          letter-spacing: -0.3px;
          margin: 0;
        }

        .card-desc {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
          line-height: 1.45;
        }

        /* ── Input Box ───────────────────────────────────────── */
        .form-group-field {
          margin-bottom: 16px;
        }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
        }

        .weight-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 2px solid #0d9488;
          border-radius: 12px;
          padding: 10px 18px;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.08);
          transition: all 0.15s ease;
        }

        .input-scale-icon {
          color: #0d9488;
          flex-shrink: 0;
        }

        .weight-input-element {
          flex: 1;
          border: none;
          outline: none;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          background: transparent;
          font-family: inherit;
        }

        .input-unit-label {
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
        }

        .btn-hitung-prediksi {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          margin-top: 14px;
          margin-bottom: 14px;
          box-shadow: 0 2px 8px rgba(13, 148, 136, 0.25);
          transition: all 0.15s ease;
        }

        .btn-hitung-prediksi:hover {
          background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.35);
        }

        .btn-hitung-prediksi:active {
          transform: translateY(0);
        }

        .btn-hitung-prediksi:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .card-helper-status {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .status-badge-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .check-icon-teal {
          color: #0d9488;
          flex-shrink: 0;
        }

        .status-text-teal {
          font-size: 13px;
          font-weight: 700;
          color: #0d9488;
        }

        .check-icon-warn {
          color: #d97706;
          flex-shrink: 0;
        }

        .status-text-warn {
          font-size: 13px;
          font-weight: 700;
          color: #d97706;
        }

        .status-subtext {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        /* ── Koefisien Stack ─────────────────────────────────── */
        .coeff-items-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .coeff-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 12px 16px;
        }

        .coeff-left-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .coeff-icon-container {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #e0f2fe;
          color: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coeff-item-name {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .coeff-item-rate {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        .coeff-footnote-text {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        /* ── Featured Mint Card ──────────────────────────────── */
        .featured-mint-card {
          background-color: #ebf9f7;
          border: 1px solid #ccefe9;
        }

        .white-subcards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .white-subcard {
          background: #ffffff;
          border: 1px solid #e0f2ee;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 1px 2px rgba(13, 148, 136, 0.05);
        }

        .subcard-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .subcard-icon-round {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #ccfbf1;
          color: #0f766e;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subcard-title-text {
          font-size: 14px;
          font-weight: 700;
          color: #0f2933;
        }

        .subcard-number-wrapper {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .subcard-big-value {
          font-size: 38px;
          font-weight: 800;
          color: #0d9488;
          line-height: 1;
          letter-spacing: -1px;
        }

        .subcard-unit-text {
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
        }

        .subcard-calc-formula {
          font-size: 12px;
          color: #64748b;
        }

        .featured-card-bottom-line {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .featured-bottom-icon {
          color: #0d9488;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .featured-bottom-text {
          font-size: 12.5px;
          color: #115e59;
          line-height: 1.45;
          font-weight: 500;
        }

        /* ── Cara Membaca Hasil ──────────────────────────────── */
        .formula-summary-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
        }

        .formula-label-muted {
          font-size: 13.5px;
          color: #64748b;
        }

        .formula-val-bold {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .horizontal-divider {
          height: 1px;
          background-color: #f1f5f9;
          margin-bottom: 14px;
        }

        .formula-desc-text {
          font-size: 13px;
          color: #475569;
          line-height: 1.55;
          margin: 0;
        }

        /* ── Amber Callout ───────────────────────────────────── */
        .amber-callout-card {
          background-color: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 16px;
          padding: 20px 24px;
        }

        .amber-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .amber-icon {
          color: #d97706;
          flex-shrink: 0;
        }

        .amber-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #92400e;
          margin: 0;
        }

        .amber-text {
          font-size: 12.5px;
          color: #92400e;
          line-height: 1.55;
          margin: 0;
          opacity: 0.95;
        }

        .amber-text-note {
          font-size: 12px;
          color: #b45309;
          margin-top: 8px;
          margin-bottom: 0;
          font-weight: 600;
        }

        /* ── Footer ─────────────────────────────────────────── */
        .desktop-page-footer {
          font-size: 12px;
          color: #94a3b8;
          padding-top: 4px;
        }

        /* ── Responsive Mobile Collapse ──────────────────────── */
        @media (max-width: 900px) {
          .desktop-grid-two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
