'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

interface DashboardLayoutProps {
  currentPageTitle: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPageTitle,
  children,
}) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopNavbar currentPageTitle={currentPageTitle} />
        <main className="page-wrapper">{children}</main>
      </div>
    </div>
  );
};
