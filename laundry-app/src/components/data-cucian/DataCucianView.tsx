'use client';

import React from 'react';
import { Calendar, ChevronDown, Plus } from 'lucide-react';
import { useDataCucianViewModel } from './hooks/useDataCucianViewModel';
import { DataCucianStats } from './DataCucianStats';
import { OrderTable } from './OrderTable';
import { ServiceSummaryCard } from './ServiceSummaryCard';
import { AddOrderModal } from '@/components/dashboard/AddOrderModal';

export const DataCucianView: React.FC = () => {
  const {
    filteredOrders,
    stats,
    serviceSummaries,
    searchQuery,
    setSearchQuery,
    selectedService,
    setSelectedService,
    activeTab,
    setActiveTab,
    tabCounts,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    handleStatusChange,
    handleCreateOrder,
  } = useDataCucianViewModel();

  return (
    <div className="data-cucian-view">
      {/* Header */}
      <div className="data-cucian-header">
        <div className="header-top-row">
          <div>
            <h1 className="page-title">Data cucian</h1>
            <p className="page-subtitle">
              Kelola pesanan dan pantau setiap tahap pengerjaan.
            </p>
          </div>

          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            <span>Tambah cucian</span>
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

      {/* Top 4 Stat Cards */}
      <DataCucianStats stats={stats} />

      {/* Table: Daftar Pesanan */}
      <OrderTable
        orders={filteredOrders}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedService={selectedService}
        onServiceChange={setSelectedService}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={tabCounts}
        onStatusChange={handleStatusChange}
      />

      {/* Bottom: Ringkasan Layanan */}
      <ServiceSummaryCard summaries={serviceSummaries} />

      {/* Footer Info */}
      <div className="page-footer-note">
        Risky Laundry • Data contoh, 8 Oktober 2026
      </div>

      {/* Interactive Modal */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleCreateOrder}
      />

      <style jsx>{`
        .data-cucian-view {
          display: flex;
          flex-direction: column;
        }

        .data-cucian-header {
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

        .page-footer-note {
          margin-top: 32px;
          font-size: 12px;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};
