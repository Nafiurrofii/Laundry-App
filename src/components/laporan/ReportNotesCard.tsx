'use client';

import React from 'react';

export const ReportNotesCard: React.FC = () => {
  return (
    <div className="report-notes-card">
      <h3 className="notes-title">Catatan laporan</h3>

      <div className="badge-pill">Cuci Setrika paling dominan</div>

      <p className="note-text">
        Cuci Setrika menyumbang 24 kg dari total 36 kg cucian. Dua pesanan Cuci Kering
        masih memiliki tagihan Rp42.000.
      </p>

      <p className="note-subtext">
        Penerimaan berdasarkan pembayaran yang masuk. Arus kas bersih bukan perhitungan
        laba akuntansi.
      </p>

      <style jsx>{`
        .report-notes-card {
          background-color: #e6f7f5;
          border: 1px solid #ccf0eb;
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .notes-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f766e;
          margin-bottom: 14px;
        }

        .badge-pill {
          display: inline-block;
          align-self: flex-start;
          font-size: 11.5px;
          font-weight: 700;
          color: #0d9488;
          background: #ffffff;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 14px;
        }

        .note-text {
          font-size: 13px;
          color: #115e59;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .note-subtext {
          font-size: 12px;
          color: #0f766e;
          line-height: 1.5;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};
