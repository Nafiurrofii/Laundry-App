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
            Berikut ringkasan operasional Risky Laundry hari ini.
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
    </div>
  );
};
