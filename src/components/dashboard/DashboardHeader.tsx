'use client';

import React from 'react';
import { Calendar, ChevronDown, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onAddClick: () => void;
  selectedDate: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onAddClick,
  selectedDate,
}) => {
  return (
    <div className="dashboard-header-container">
      <div className="header-top-row">
        <div>
          <h1 className="page-title">Selamat pagi, Nadia 👋</h1>
          <p className="page-subtitle">
            Berikut ringkasan operasional Bilas Laundry hari ini.
          </p>
        </div>

        <button className="btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Tambah cucian</span>
        </button>
      </div>

      <div className="header-meta-row">
        <button className="date-picker-btn">
          <Calendar size={16} className="calendar-icon" />
          <span>{selectedDate}</span>
          <ChevronDown size={14} className="chevron-icon" />
        </button>

        <span className="today-badge">Hari ini</span>
        <span className="last-updated">Terakhir diperbarui 10.30 WIB</span>
      </div>

      <style jsx>{`
        .dashboard-header-container {
          margin-bottom: 24px;
        }

        .header-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
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
          transition: all 0.15s ease;
        }

        .date-picker-btn:hover {
          border-color: #cbd5e1;
          background: #fafbfd;
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
      `}</style>
    </div>
  );
};
