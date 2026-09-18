import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, Users, Bell, MapPin } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import PhcHome from './pages/PhcHome';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import HeatmapPage from '../district/pages/HeatmapPage';
import NotificationsPage from '@/features/shared/NotificationsPage';

export default function PhcDashboard() {
  const nav = [
    { path: '/dashboard/phc',               labelKey: 'nav.dashboard',       icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/dashboard/phc/analytics',     labelKey: 'nav.analytics',       icon: <BarChart3 className="h-5 w-5" /> },
    { path: '/dashboard/phc/reports',       labelKey: 'phc.medicalReports',  icon: <FileText className="h-5 w-5" /> },
    { path: '/dashboard/phc/heatmap',       labelKey: 'district.heatmapTitle', icon: <MapPin className="h-5 w-5" /> },
    { path: '/dashboard/phc/patients',      labelKey: 'phc.totalPatients',   icon: <Users className="h-5 w-5" /> },
    { path: '/dashboard/phc/notifications', labelKey: 'nav.notifications',   icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <DashboardLayout titleKey="phc.dashboardTitle" navItems={nav}>
      <Routes>
        <Route index element={<PhcHome />} />
        <Route path="analytics"     element={<AnalyticsPage />} />
        <Route path="reports"       element={<ReportsPage />} />
        <Route path="heatmap"       element={<HeatmapPage />} />
        <Route path="patients"      element={<PhcHome />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*"             element={<Navigate to="/dashboard/phc" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
