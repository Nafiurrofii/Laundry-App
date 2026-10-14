'use client';

import React from 'react';
import { useDashboardViewModel } from './hooks/useDashboardViewModel';
import { DashboardHeader } from './DashboardHeader';
import { MetricCards } from './MetricCards';
import { NotificationBanner } from './NotificationBanner';
import { RevenueChartCard } from './RevenueChartCard';
import { OperationalStatusCard } from './OperationalStatusCard';
import { RecentOrdersTable } from './RecentOrdersTable';
import { AddOrderModal } from './AddOrderModal';

export const DashboardView: React.FC = () => {
  const {
    state,
    openAddModal,
    closeAddModal,
    handleCreateOrder,
  } = useDashboardViewModel();

  return (
    <div className="dashboard-view-container">
      {/* Header */}
      <DashboardHeader
        onAddClick={openAddModal}
        selectedDate={state.selectedDate}
      />

      {/* Top 4 Metric Cards */}
      <MetricCards metrics={state.metrics} />

      {/* Alert Banner for ready orders */}
      <NotificationBanner
        readyCount={state.metrics.readyPickupCount}
        customers={state.metrics.readyPickupCustomers}
      />

      {/* Grid: Revenue Trend (Left) & Operational Status (Right) */}
      <div className="dashboard-grid-two">
        <RevenueChartCard
          trendItems={state.revenueTrend}
          totalRevenue={state.total7DaysRevenue}
        />
        <OperationalStatusCard statusCounts={state.operationalStatus} />
      </div>

      {/* Bottom Table: Cucian terbaru */}
      <RecentOrdersTable orders={state.recentOrders} />

      {/* Footer Info */}
      <div className="page-footer-note">
        Risky Laundry • Data contoh, 8 Oktober 2026
      </div>

      {/* Interactive Add Order Modal */}
      <AddOrderModal
        isOpen={state.isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleCreateOrder}
      />

      <style jsx>{`
        .dashboard-view-container {
          display: flex;
          flex-direction: column;
        }

        .dashboard-grid-two {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 20px;
        }

        .page-footer-note {
          margin-top: 32px;
          font-size: 12px;
          color: #94a3b8;
          text-align: left;
        }

        @media (max-width: 1024px) {
          .dashboard-grid-two {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
