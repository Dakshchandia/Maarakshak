import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Bell } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AshaHome from './pages/AshaHome';
import PriorityListPage from './pages/PriorityListPage';
import FollowUpPage from './pages/FollowUpPage';
import NotificationsPage from '@/features/shared/NotificationsPage';

export default function AshaDashboard() {
  const nav = [
    { path: '/dashboard/asha',               labelKey: 'nav.dashboard',    icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/dashboard/asha/priority',      labelKey: 'nav.priority',     icon: <Users className="h-5 w-5" /> },
    { path: '/dashboard/asha/follow-ups',    labelKey: 'nav.followUps',    icon: <Bell className="h-5 w-5" /> },
    { path: '/dashboard/asha/notifications', labelKey: 'nav.notifications', icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <DashboardLayout titleKey="asha.dashboardTitle" navItems={nav}>
      <Routes>
        <Route index element={<AshaHome />} />
        <Route path="priority"      element={<PriorityListPage />} />
        <Route path="follow-ups"    element={<FollowUpPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*"             element={<Navigate to="/dashboard/asha" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
