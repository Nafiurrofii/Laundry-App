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
            <Waves size={24} />
          </div>
          <span className="brand-name">LaundryKu</span>
        </Link>

        <div className="branch-card">
          <div className="branch-title">Risky Laundry</div>
          <div className="branch-subtitle">Cabang Melati • Bandung</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav-section">
        <div className="sidebar-section-label">RUANG KERJA</div>
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
    </aside>
  );
};
