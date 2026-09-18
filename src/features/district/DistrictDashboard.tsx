import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, MapPin, Users, Bell } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import DistrictHome from './pages/DistrictHome';
import DistrictAnalytics from './pages/DistrictAnalytics';
import HeatmapPage from './pages/HeatmapPage';
import NotificationsPage from '@/features/shared/NotificationsPage';

export default function DistrictDashboard() {
  const nav = [
    { path: '/dashboard/district',               labelKey: 'nav.dashboard',             icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/dashboard/district/analytics',     labelKey: 'district.analytics',        icon: <BarChart3 className="h-5 w-5" /> },
    { path: '/dashboard/district/heatmap',       labelKey: 'district.heatmapTitle',     icon: <MapPin className="h-5 w-5" /> },
    { path: '/dashboard/district/population',    labelKey: 'district.activePregnancies', icon: <Users className="h-5 w-5" /> },
    { path: '/dashboard/district/notifications', labelKey: 'nav.notifications',         icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <DashboardLayout titleKey="district.dashboardTitle" navItems={nav}>
      <Routes>
        <Route index element={<DistrictHome />} />
        <Route path="analytics"     element={<DistrictAnalytics />} />
        <Route path="heatmap"       element={<HeatmapPage />} />
        <Route path="population"    element={<DistrictHome />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*"             element={<Navigate to="/dashboard/district" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
