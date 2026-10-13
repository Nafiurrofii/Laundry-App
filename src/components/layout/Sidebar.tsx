'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Receipt,
  Wallet,
  TrendingUp,
  FlaskConical,
  ExternalLink,
  Sparkles,
  Waves,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Cucian', href: '/data-cucian', icon: Layers },
  { name: 'Transaksi', href: '/transaksi', icon: Receipt },
  { name: 'Cash Flow', href: '/cash-flow', icon: Wallet },
  { name: 'Laporan', href: '/laporan', icon: TrendingUp },
  { name: 'Prediksi Bahan Baku', href: '/prediksi-bahan-baku', icon: FlaskConical },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link href="/dashboard" className="brand-logo">
          <div className="logo-icon-wrap">
            <Waves className="logo-svg" size={24} />
          </div>
          <span className="brand-name">LaundryKu</span>
        </Link>

        <div className="branch-card">
          <div className="branch-title">Bilas Laundry</div>
          <div className="branch-subtitle">Cabang Melati • Bandung</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav-section">
        <div className="section-title">RUANG KERJA</div>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard' && pathname === '/') ||
              (item.href === '/transaksi' && pathname === '/transaksi');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} className="nav-icon" />
                <span className="nav-text">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets */}
      <div className="sidebar-footer">
        <div className="feature-promo-card">
          <div className="promo-header">
            <Sparkles size={18} className="promo-icon" />
            <span className="promo-title">Operasional lebih tertata.</span>
          </div>
          <p className="promo-desc">
            Pantau cucian dan kebutuhan bahan dalam satu tempat.
          </p>
        </div>

        <Link href="/katalog" className="customer-catalog-link" target="_blank">
          <ExternalLink size={15} />
          <span>Lihat katalog pelanggan</span>
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          min-width: 260px;
          background: #ffffff;
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          padding: 24px 16px 20px;
          z-index: 40;
        }

        .sidebar-header {
          margin-bottom: 24px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px 18px;
        }

        .logo-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(13, 148, 136, 0.25);
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .branch-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
        }

        .branch-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .branch-subtitle {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .sidebar-nav-section {
          flex: 1;
          overflow-y: auto;
        }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.6px;
          padding: 0 10px 10px;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #475569;
          transition: all 0.15s ease;
        }

        .nav-item:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }

        .nav-item.active {
          background-color: #e0f4f1;
          color: #0f766e;
          font-weight: 600;
        }

        .nav-item.active .nav-icon {
          color: #0d9488;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-top: 16px;
        }

        .feature-promo-card {
          background: #e6f7f5;
          border-radius: 14px;
          padding: 14px;
          border: 1px solid #ccf0eb;
        }

        .promo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .promo-icon {
          color: #0d9488;
        }

        .promo-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f766e;
        }

        .promo-desc {
          font-size: 11px;
          color: #115e59;
          line-height: 1.45;
        }

        .customer-catalog-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          padding: 6px 8px;
          border-radius: 8px;
          transition: color 0.15s ease;
        }

        .customer-catalog-link:hover {
          color: #0d9488;
        }
      `}</style>
    </aside>
  );
};
