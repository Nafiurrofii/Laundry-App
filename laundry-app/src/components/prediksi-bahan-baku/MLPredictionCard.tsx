'use client';

import React from 'react';
import {
  Brain,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  Loader2,
  Droplet,
  Sparkles,
  FlaskConical,
  Clock,
} from 'lucide-react';
import { MLPredictionState } from './types';

interface MLPredictionCardProps {
  weightKg: number;
  mlState: MLPredictionState;
  onRetry: () => void;
}

/** Format angka desimal menjadi tampilan mL yang mudah dibaca */
function formatMl(val: number): string {
  const rounded = Math.round(val * 10) / 10;
  return rounded.toLocaleString('id-ID', { maximumFractionDigits: 1 });
}

/** Format tanggal ke jam:menit:detik lokal */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const MLPredictionCard: React.FC<MLPredictionCardProps> = ({
  weightKg,
  mlState,
  onRetry,
}) => {
  const { isLoading, error, prediksi, lastFetchedAt } = mlState;

  // Ambil nilai prediksi (nama target dinamis dari model)
  const keys = prediksi ? Object.keys(prediksi) : [];
  const sabunKey = keys.find((k) => k.toLowerCase().includes('sabun')) ?? keys[0];
  const parfumKey = keys.find((k) => k.toLowerCase().includes('parfum')) ?? keys[1];

  return (
    <div className="ml-card">
      {/* Header */}
      <div className="ml-card-header">
        <div className="ml-header-left">
          <div className="ml-icon-badge">
            <Brain size={18} />
          </div>
          <div>
            <h3 className="ml-title">Prediksi Model ML (Random Forest)</h3>
            <p className="ml-subtitle">
              Hasil prediksi kebutuhan bahan baku dari model machine learning yang dilatih pada data operasional
              laundry
            </p>
          </div>
        </div>

        <button
          className={`ml-refresh-btn ${isLoading ? 'loading' : ''}`}
          onClick={onRetry}
          disabled={isLoading}
          title="Refresh prediksi"
        >
          {isLoading ? <Loader2 size={15} className="spin-icon" /> : <RefreshCw size={15} />}
          <span>{isLoading ? 'Memuat...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Content area */}
      <div className="ml-content">
        {/* Loading state */}
        {isLoading && !prediksi && (
          <div className="ml-placeholder loading-state">
            <Loader2 size={28} className="spin-icon placeholder-icon" />
            <p className="placeholder-text">Menghubungi model AI...</p>
            <p className="placeholder-sub">Mengirim {weightKg} kg ke Python API</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="ml-placeholder error-state">
            <WifiOff size={28} className="placeholder-icon error-icon" />
            <p className="placeholder-text">Python API Tidak Tersedia</p>
            <p className="placeholder-sub">{error}</p>
            <div className="error-hint">
              <FlaskConical size={13} />
              <span>
                Jalankan server Python: <code>uvicorn main:app --reload</code> di folder{' '}
                <code>Python_api/</code>
              </span>
            </div>
            <button className="retry-btn" onClick={onRetry}>
              <RefreshCw size={13} />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Success state — tampilkan hasil */}
        {prediksi && (
          <div className={`ml-results ${isLoading ? 'refreshing' : ''}`}>
            {/* Indikator input */}
            <div className="ml-input-badge">
              <span className="input-badge-label">Input Model:</span>
              <span className="input-badge-value">{weightKg} kg cucian</span>
            </div>

            {/* Grid hasil prediksi */}
            <div className="ml-results-grid">
              {/* Sabun / Deterjen */}
              {sabunKey && (
                <div className="ml-result-item item-sabun">
                  <div className="result-item-header">
                    <div className="result-icon-wrap icon-sabun">
                      <Droplet size={16} />
                    </div>
                    <div>
                      <div className="result-label">
                        {sabunKey.replace(/_/g, ' ')}
                      </div>
                      <div className="result-cat">Deterjen / Sabun Cair</div>
                    </div>
                  </div>
                  <div className="result-value">
                    {formatMl(prediksi[sabunKey])}
                    <span className="result-unit"> ml</span>
                  </div>
                  <div className="result-liter">
                    ≈ {(prediksi[sabunKey] / 1000).toFixed(3)} Liter
                  </div>
                  <div className="result-per-kg">
                    ~{(prediksi[sabunKey] / weightKg).toFixed(1)} ml per kg
                  </div>
                </div>
              )}

              {/* Parfum */}
              {parfumKey && parfumKey !== sabunKey && (
                <div className="ml-result-item item-parfum">
                  <div className="result-item-header">
                    <div className="result-icon-wrap icon-parfum">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="result-label">
                        {parfumKey.replace(/_/g, ' ')}
                      </div>
                      <div className="result-cat">Parfum Laundry</div>
                    </div>
                  </div>
                  <div className="result-value">
                    {formatMl(prediksi[parfumKey])}
                    <span className="result-unit"> ml</span>
                  </div>
                  <div className="result-liter">
                    ≈ {(prediksi[parfumKey] / 1000).toFixed(3)} Liter
                  </div>
                  <div className="result-per-kg">
                    ~{(prediksi[parfumKey] / weightKg).toFixed(1)} ml per kg
                  </div>
                </div>
              )}

              {/* Jika ada target lain selain sabun & parfum */}
              {keys
                .filter((k) => k !== sabunKey && k !== parfumKey)
                .map((key) => (
                  <div key={key} className="ml-result-item item-other">
                    <div className="result-item-header">
                      <div className="result-icon-wrap icon-other">
                        <FlaskConical size={16} />
                      </div>
                      <div>
                        <div className="result-label">{key.replace(/_/g, ' ')}</div>
                        <div className="result-cat">Bahan Lainnya</div>
                      </div>
                    </div>
                    <div className="result-value">
                      {formatMl(prediksi[key])}
                      <span className="result-unit"> ml</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer: timestamp & model info */}
            <div className="ml-footer">
              <div className="ml-footer-left">
                <CheckCircle2 size={13} className="ok-icon" />
                <span>Prediksi berhasil dari model Random Forest</span>
              </div>
              {lastFetchedAt && (
                <div className="ml-footer-right">
                  <Clock size={12} />
                  <span>Diperbarui: {formatTime(lastFetchedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .ml-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: var(--radius-lg, 16px);
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
          position: relative;
          overflow: hidden;
        }

        .ml-card::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Header */
        .ml-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .ml-header-left {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .ml-icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .ml-title {
          font-size: 16px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 4px;
        }

        .ml-subtitle {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
          max-width: 480px;
        }

        .ml-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .ml-refresh-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }

        .ml-refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Placeholder states */
        .ml-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          gap: 8px;
          text-align: center;
        }

        .placeholder-icon {
          color: #64748b;
          margin-bottom: 4px;
        }

        .placeholder-text {
          font-size: 15px;
          font-weight: 700;
          color: #e2e8f0;
        }

        .placeholder-sub {
          font-size: 12.5px;
          color: #94a3b8;
        }

        .error-icon {
          color: #f87171 !important;
        }

        .error-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 8px;
          padding: 8px 14px;
          color: #fca5a5;
          font-size: 11.5px;
          margin-top: 6px;
          max-width: 420px;
        }

        .error-hint code {
          background: rgba(255, 255, 255, 0.08);
          padding: 1px 5px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 11px;
        }

        .retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          background: #6366f1;
          color: #fff;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .retry-btn:hover {
          background: #4f46e5;
        }

        /* Results */
        .ml-results {
          transition: opacity 0.25s ease;
        }

        .ml-results.refreshing {
          opacity: 0.6;
        }

        .ml-input-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 8px;
          padding: 6px 14px;
          margin-bottom: 16px;
        }

        .input-badge-label {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        .input-badge-value {
          font-size: 13px;
          font-weight: 700;
          color: #a5b4fc;
        }

        .ml-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }

        .ml-result-item {
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-sabun {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(56, 189, 248, 0.06) 100%);
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .item-parfum {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(244, 114, 182, 0.06) 100%);
          border: 1px solid rgba(244, 114, 182, 0.2);
        }

        .item-other {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%);
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .result-item-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .result-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-sabun {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
        }

        .icon-parfum {
          background: rgba(244, 114, 182, 0.2);
          color: #f472b6;
        }

        .icon-other {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
        }

        .result-label {
          font-size: 12px;
          font-weight: 700;
          color: #e2e8f0;
          text-transform: capitalize;
        }

        .result-cat {
          font-size: 10.5px;
          color: #64748b;
          margin-top: 1px;
        }

        .result-value {
          font-size: 32px;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -1px;
          line-height: 1;
          margin: 4px 0;
        }

        .result-unit {
          font-size: 16px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0;
        }

        .result-liter {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .result-per-kg {
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }

        /* Footer */
        .ml-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 11.5px;
          color: #64748b;
        }

        .ml-footer-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ok-icon {
          color: #22c55e;
        }

        .ml-footer-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Spinner */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .ml-card-header {
            flex-direction: column;
          }
          .ml-results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
