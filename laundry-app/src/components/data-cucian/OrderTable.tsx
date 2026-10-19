'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { TransactionWithRelations, LaundryStatus } from '@/lib/database.types';
import { LAUNDRY_STATUS_LABEL } from '@/lib/database.types';
import { StatusFilterTab } from './types';

interface OrderTableProps {
  orders: TransactionWithRelations[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedService: string;
  onServiceChange: (val: string) => void;
  activeTab: StatusFilterTab;
  onTabChange: (tab: StatusFilterTab) => void;
  tabCounts: {
    semua: number;
    dalam_proses: number;
    siap_diambil: number;
    selesai: number;
  };
  onStatusChange: (receiptNumber: string, newStatus: LaundryStatus) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  searchQuery,
  onSearchChange,
  selectedService,
  onServiceChange,
  activeTab,
  onTabChange,
  tabCounts,
  onStatusChange,
}) => {
  const getBadgeClass = (status: LaundryStatus) => {
    switch (status) {
      case 'Processing':
        return 'badge-dicuci';
      case 'Completed':
        return 'badge-siap';
      case 'Picked Up':
        return 'badge-selesai';
      case 'Received':
      default:
        return 'badge-diterima';
    }
  };

  return (
    <div className="card table-card">
      <div className="table-header">
        <h3 className="section-title">Daftar pesanan</h3>
        <p className="section-subtitle">
          Pesanan diurutkan dari yang paling baru.
        </p>
      </div>

      {/* Filter Row: Search & Service dropdown */}
      <div className="filter-controls-row">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari nama atau nomor pesanan"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="select-dropdown-wrap">
          <select
            className="service-select"
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
          >
            <option value="Semua layanan">Semua layanan</option>
            <option value="Cuci Setrika">Cuci Setrika</option>
            <option value="Cuci Kering">Cuci Kering</option>
            <option value="Cuci Basah">Cuci Basah</option>
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="tabs-bar">
        <button
          className={`filter-pill ${activeTab === 'semua' ? 'active' : ''}`}
          onClick={() => onTabChange('semua')}
        >
          Semua ({tabCounts.semua})
        </button>
        <button
          className={`filter-pill ${activeTab === 'dalam_proses' ? 'active' : ''}`}
          onClick={() => onTabChange('dalam_proses')}
        >
          Dalam proses ({tabCounts.dalam_proses})
        </button>
        <button
          className={`filter-pill ${activeTab === 'siap_diambil' ? 'active' : ''}`}
          onClick={() => onTabChange('siap_diambil')}
        >
          Siap diambil ({tabCounts.siap_diambil})
        </button>
        <button
          className={`filter-pill ${activeTab === 'selesai' ? 'active' : ''}`}
          onClick={() => onTabChange('selesai')}
        >
          Selesai ({tabCounts.selesai})
        </button>
      </div>

      {/* Table Data */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Pesanan</th>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Berat</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ubah Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state-cell">
                  Tidak ada pesanan yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.receipt_number}>
                  <td className="order-id-cell">{order.receipt_number}</td>
                  <td className="customer-cell">{order.customer?.name || 'Pelanggan'}</td>
                  <td>{order.service?.service_name || '-'}</td>
                  <td>{order.weight_kg ?? 0} kg</td>
                  <td className="total-cell">
                    Rp{(order.total_price ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td>
                    <span className={`badge ${getBadgeClass(order.status)}`}>
                      {LAUNDRY_STATUS_LABEL[order.status]}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      className="status-selector"
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(order.receipt_number, e.target.value as LaundryStatus)
                      }
                    >
                      <option value="Received">Diterima</option>
                      <option value="Processing">Diproses</option>
                      <option value="Completed">Siap Diambil</option>
                      <option value="Picked Up">Selesai</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pagination-bar">
        <span className="pagination-info">
          Menampilkan {orders.length} dari {tabCounts.semua} pesanan
        </span>
        <div className="page-nums">
          <button className="page-num-btn active">1</button>
        </div>
      </div>

      <style jsx>{`
        .table-card {
          padding: 24px;
          background: #ffffff;
          margin-bottom: 24px;
        }

        .table-header {
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .section-subtitle {
          font-size: 12.5px;
          color: #64748b;
          margin-top: 2px;
        }

        .filter-controls-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .select-dropdown-wrap {
          position: relative;
          min-width: 170px;
        }

        .service-select {
          width: 100%;
          padding: 10px 34px 10px 14px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          appearance: none;
          cursor: pointer;
          outline: none;
        }

        .service-select:focus {
          border-color: var(--primary);
        }

        .select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        .tabs-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }

        .filter-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background-color: transparent;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .filter-pill:hover {
          background-color: #f1f5f9;
        }

        .filter-pill.active {
          background-color: #0f766e;
          color: #ffffff;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .order-id-cell {
          font-weight: 700;
          color: #0d9488;
        }

        .customer-cell {
          font-weight: 600;
          color: #0f172a;
        }

        .total-cell {
          font-weight: 600;
          color: #0f172a;
        }

        .status-selector {
          padding: 4px 8px;
          font-size: 11.5px;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          background: #ffffff;
          color: #334155;
          cursor: pointer;
        }

        .status-selector:focus {
          border-color: var(--primary);
        }

        .empty-state-cell {
          text-align: center;
          padding: 36px !important;
          color: #94a3b8;
          font-size: 13.5px;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .pagination-info {
          font-size: 12.5px;
          color: #64748b;
        }

        .page-num-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          background: #e6f7f5;
          color: #0f766e;
        }
      `}</style>
    </div>
  );
};
