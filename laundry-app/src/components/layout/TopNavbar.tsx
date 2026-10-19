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
    </header>
  );
};
