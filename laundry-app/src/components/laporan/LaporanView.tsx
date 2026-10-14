'use client';

import React from 'react';
import { Calendar, ChevronDown, Download } from 'lucide-react';
import { useLaporanViewModel } from './hooks/useLaporanViewModel';
import { LaporanSummaryCards } from './LaporanSummaryCards';
import { RevenueChartCard } from '@/components/dashboard/RevenueChartCard';
import { DashboardService } from '@/components/dashboard/service/dashboardService';
import { ServiceCompositionBars } from './ServiceCompositionBars';
import { ServiceBreakdownTable } from './ServiceBreakdownTable';
import { FinancialSummaryCard } from './FinancialSummaryCard';
import { ReportNotesCard } from './ReportNotesCard';

export const LaporanView: React.FC = () => {
  const { state, handleDownloadPDF } = useLaporanViewModel();
  const trendItems = DashboardService.getRevenueTrend();

  return (
    <div className="laporan-view">
      {/* Header */}
      <div className="laporan-header">
        <div className="header-top-row">
          <div>
            <h1 className="page-title">Laporan operasional</h1>
            <p className="page-subtitle">
              Ringkasan cucian dan keuangan untuk keputusan yang lebih jelas.
            </p>
          </div>

          <button className="btn-outline download-btn" onClick={handleDownloadPDF}>
            <Download size={16} />
            <span>Unduh PDF</span>
          </button>
        </div>

        <div className="header-meta-row">
          <button className="date-picker-btn">
            <Calendar size={16} className="calendar-icon" />
            <span>8 Oktober 2026</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>

          <span className="today-badge">Hari ini</span>
          <span className="last-updated">Terakhir diperbarui 10.30 WIB</span>
        </div>
      </div>

      {/* 4 Cards Metrik */}
      <LaporanSummaryCards summary={state.summary} />

      {/* Grid: Tren Penerimaan & Komposisi Layanan */}
      <div className="grid-two-cols">
        <RevenueChartCard
          trendItems={trendItems}
          totalRevenue={state.total7DaysRevenue}
        />
        <ServiceCompositionBars
          composition={state.serviceComposition}
          totalWeight={state.summary.totalWeight}
        />
      </div>

      {/* Tabel Rincian per Layanan */}
      <ServiceBreakdownTable
        details={state.serviceDetails}
        totalDetail={state.totalDetail}
      />

      {/* Grid 2 Bawah: Ringkasan Keuangan & Catatan Laporan */}
      <div className="grid-two-cols">
        <FinancialSummaryCard recap={state.financialRecap} />
        <ReportNotesCard />
      </div>

      {/* Footer Info */}
      <div className="page-footer-note">
        Risky Laundry • Data contoh, 8 Oktober 2026
      </div>

      <style jsx>{`
        .laporan-view {
          display: flex;
          flex-direction: column;
        }

        .laporan-header {
          margin-bottom: 24px;
        }

        .header-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .download-btn {
          padding: 10px 18px;
          font-weight: 600;
        }

        .header-meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
        }

        .date-picker-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .calendar-icon {
          color: #0d9488;
        }

        .chevron-icon {
          color: #94a3b8;
        }

        .today-badge {
          background-color: #e6f7f5;
          color: #0f766e;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .last-updated {
          font-size: 12.5px;
          color: #64748b;
        }

        .grid-two-cols {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .page-footer-note {
          margin-top: 32px;
          font-size: 12px;
          color: #94a3b8;
        }

        @media (max-width: 1024px) {
          .grid-two-cols {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
