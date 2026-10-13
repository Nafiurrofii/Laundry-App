'use client';

import React from 'react';
import { Bell } from 'lucide-react';

interface TopNavbarProps {
  currentPageTitle: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ currentPageTitle }) => {
  return (
    <header className="top-navbar">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-root">Ruang kerja</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{currentPageTitle}</span>
      </div>

      {/* Right actions & user profile */}
      <div className="navbar-right">
        {/* Notification Button */}
        <button className="notif-btn" aria-label="Notifikasi">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        {/* User profile */}
        <div className="user-profile">
          <div className="avatar-circle">NA</div>
          <div className="user-info">
            <span className="user-name">Nadia Amalia</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .top-navbar {
          height: 68px;
          background: #ffffff;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 36px;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
        }

        .breadcrumb-root {
          color: var(--text-secondary);
        }

        .breadcrumb-separator {
          color: var(--text-muted);
        }

        .breadcrumb-current {
          color: var(--text-primary);
          font-weight: 600;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notif-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: background-color 0.15s ease;
        }

        .notif-btn:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }

        .notif-dot {
          position: absolute;
          top: 8px;
          right: 9px;
          width: 7px;
          height: 7px;
          background-color: #0d9488;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 8px;
          border-left: 1px solid var(--border-light);
        }

        .avatar-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ccfbf1;
          color: #0f766e;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .user-role {
          font-size: 11px;
          color: var(--text-secondary);
        }
      `}</style>
    </header>
  );
};
