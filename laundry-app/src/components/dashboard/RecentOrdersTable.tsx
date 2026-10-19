'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { TransactionWithRelations, LaundryStatus } from '@/lib/database.types';
import { LAUNDRY_STATUS_LABEL } from '@/lib/database.types';

interface RecentOrdersTableProps {
  orders: TransactionWithRelations[];
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
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
    <div className="card orders-card">
      <div className="orders-header">
        <div>
          <h3 className="section-title">Cucian terbaru</h3>
          <p className="section-subtitle">Pesanan masuk pada 8 Oktober 2026</p>
        </div>

        <Link href="/data-cucian" className="view-all-link">
          <span>Semua cucian</span>
          <ArrowRight size={15} />
        </Link>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.receipt_number}>
                <td className="order-id-cell">{order.receipt_number}</td>
                <td className="customer-cell">{order.customer?.name ?? ''}</td>
                <td>{order.service?.service_name ?? ''}</td>
                <td>{order.weight_kg} kg</td>
                <td className="total-cell">
                  Rp{(order.total_price ?? 0).toLocaleString('id-ID')}
                </td>
                <td>
                  <span className={`badge ${getBadgeClass(order.status)}`}>
                    {LAUNDRY_STATUS_LABEL[order.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .orders-card {
          margin-top: 24px;
          padding: 24px;
          background: #ffffff;
        }

        .orders-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
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

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #0d9488;
          transition: transform 0.15s ease;
        }

        .view-all-link:hover {
          transform: translateX(2px);
          color: #0f766e;
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
      `}</style>
    </div>
  );
};
