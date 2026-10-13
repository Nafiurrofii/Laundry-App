'use client';

import React from 'react';
import { Search, Receipt, Printer, X, CheckCircle2 } from 'lucide-react';
import { useTransaksiViewModel } from './hooks/useTransaksiViewModel';

export const TransaksiView: React.FC = () => {
  const {
    filteredOrders,
    filter,
    setFilter,
    selectedOrder,
    isReceiptModalOpen,
    viewReceipt,
    closeReceipt,
  } = useTransaksiViewModel();

  return (
    <div className="transaksi-view">
      <div className="transaksi-header">
        <h1 className="page-title">Transaksi & Pembayaran</h1>
        <p className="page-subtitle">
          Daftar seluruh nota transaksi cucian dan status pembayaran pelanggan.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card filter-bar-card">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari nomor nota atau nama pelanggan..."
            value={filter.search}
            onChange={(e) =>
              setFilter({ ...filter, search: e.target.value })
            }
          />
        </div>

        <div className="pills-row">
          <button
            className={`pill-btn ${filter.paymentStatus === 'semua' ? 'active' : ''}`}
            onClick={() => setFilter({ ...filter, paymentStatus: 'semua' })}
          >
            Semua
          </button>
          <button
            className={`pill-btn ${filter.paymentStatus === 'lunas' ? 'active' : ''}`}
            onClick={() => setFilter({ ...filter, paymentStatus: 'lunas' })}
          >
            Lunas
          </button>
          <button
            className={`pill-btn ${filter.paymentStatus === 'belum_lunas' ? 'active' : ''}`}
            onClick={() => setFilter({ ...filter, paymentStatus: 'belum_lunas' })}
          >
            Belum Lunas
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>No. Nota</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Berat</th>
                <th>Total Biaya</th>
                <th>Status Bayar</th>
                <th>Metode</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td className="id-cell">{o.id}</td>
                  <td className="cust-cell">{o.customerName}</td>
                  <td>{o.service}</td>
                  <td>{o.weight} kg</td>
                  <td className="bold-cell">
                    Rp{o.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        o.isPaid ? 'badge-siap' : 'badge-keluar'
                      }`}
                    >
                      {o.isPaid ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </td>
                  <td>{o.paymentMethod || '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-outline view-receipt-btn"
                      onClick={() => viewReceipt(o)}
                    >
                      <Receipt size={14} />
                      <span>Nota</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nota Digital */}
      {isReceiptModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeReceipt}>
          <div className="modal-content receipt-box" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header">
              <div className="receipt-brand">LaundryKu</div>
              <div className="receipt-sub">Bilas Laundry • Cabang Melati Bandung</div>
              <button className="receipt-close" onClick={closeReceipt}>
                <X size={18} />
              </button>
            </div>

            <div className="dashed-divider" />

            <div className="receipt-details">
              <div className="receipt-row">
                <span>No. Nota:</span>
                <strong>{selectedOrder.id}</strong>
              </div>
              <div className="receipt-row">
                <span>Pelanggan:</span>
                <strong>{selectedOrder.customerName}</strong>
              </div>
              <div className="receipt-row">
                <span>Layanan:</span>
                <span>{selectedOrder.service}</span>
              </div>
              <div className="receipt-row">
                <span>Berat:</span>
                <span>{selectedOrder.weight} kg</span>
              </div>
              <div className="receipt-row">
                <span>Tarif/kg:</span>
                <span>Rp{selectedOrder.pricePerKg.toLocaleString('id-ID')}</span>
              </div>
              <div className="receipt-row">
                <span>Status Cucian:</span>
                <span className="badge badge-siap">{selectedOrder.status}</span>
              </div>
            </div>

            <div className="dashed-divider" />

            <div className="receipt-total-row">
              <span>TOTAL</span>
              <span className="total-val">
                Rp{selectedOrder.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="receipt-row mt-2">
              <span>Status Bayar:</span>
              <strong className={selectedOrder.isPaid ? 'text-teal' : 'text-danger'}>
                {selectedOrder.isPaid ? 'LUNAS' : 'BELUM DIBAYAR'}
              </strong>
            </div>

            <div className="receipt-footer-actions">
              <button
                className="btn-primary w-full"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>Cetak Nota</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .transaksi-view {
          display: flex;
          flex-direction: column;
        }

        .transaksi-header {
          margin-bottom: 24px;
        }

        .filter-bar-card {
          padding: 16px 20px;
          background: #ffffff;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .pills-row {
          display: flex;
          gap: 6px;
        }

        .pill-btn {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          transition: all 0.15s ease;
        }

        .pill-btn.active {
          background-color: #0f766e;
          color: #ffffff;
        }

        .table-card {
          padding: 24px;
          background: #ffffff;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .id-cell {
          font-weight: 700;
          color: #0d9488;
        }

        .cust-cell {
          font-weight: 600;
          color: #0f172a;
        }

        .bold-cell {
          font-weight: 700;
          color: #0f172a;
        }

        .view-receipt-btn {
          padding: 5px 10px;
          font-size: 12px;
        }

        /* Modal receipt style */
        .receipt-box {
          max-width: 400px;
          font-family: monospace;
          background: #ffffff;
        }

        .receipt-header {
          text-align: center;
          position: relative;
        }

        .receipt-brand {
          font-size: 20px;
          font-weight: 800;
          color: #0d9488;
        }

        .receipt-sub {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
        }

        .receipt-close {
          position: absolute;
          right: 0;
          top: 0;
          color: #94a3b8;
        }

        .dashed-divider {
          border-bottom: 1px dashed #cbd5e1;
          margin: 16px 0;
        }

        .receipt-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13px;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          font-weight: 800;
        }

        .total-val {
          color: #0d9488;
        }

        .text-teal {
          color: #0d9488;
        }

        .text-danger {
          color: #ea580c;
        }

        .mt-2 {
          margin-top: 8px;
        }

        .receipt-footer-actions {
          margin-top: 24px;
        }

        .w-full {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
