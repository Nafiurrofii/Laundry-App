'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

interface NotificationBannerProps {
  readyCount: number;
  customers: string[];
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  readyCount,
  customers,
}) => {
  if (readyCount === 0) return null;

  const customerText =
    customers.length > 0 ? customers.slice(0, 2).join(' serta ') : 'pelanggan';

  return (
    <div className="notification-banner">
      <div className="banner-content">
        <div className="banner-icon-box">
          <Package size={18} />
        </div>
        <p className="banner-text">
          <strong>{readyCount} pesanan siap diambil.</strong> Pastikan kemasan dan
          nota {customerText} sudah sesuai.
        </p>
      </div>

      <Link href="/data-cucian" className="banner-action-link">
        <span>Lihat data cucian</span>
        <ArrowRight size={15} />
      </Link>

      <style jsx>{`
        .notification-banner {
          background-color: #e6f7f5;
          border: 1px solid #ccf0eb;
          border-radius: var(--radius-lg);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .banner-icon-box {
          color: #0d9488;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-text {
          font-size: 13.5px;
          color: #0f766e;
          line-height: 1.4;
        }

        .banner-text strong {
          font-weight: 700;
        }

        .banner-action-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #0d9488;
          white-space: nowrap;
          transition: transform 0.15s ease;
        }

        .banner-action-link:hover {
          transform: translateX(2px);
          color: #0f766e;
        }
      `}</style>
    </div>
  );
};
