import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const titles = {
  '/dashboard': 'Dashboard',
  '/properties': 'Properties',
  '/leases': 'Leases',
  '/payments': 'Payments',
  '/maintenance': 'Maintenance Requests',
  '/tenants': 'Tenants',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = titles[pathname] || 'RentPro';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-actions">
            <span style={{ fontSize: 12, color: 'var(--text-light)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
